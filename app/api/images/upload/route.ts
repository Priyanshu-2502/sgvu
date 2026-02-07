import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { promises as fs } from 'fs'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get('file') as File | null
    const type = (form.get('type') as string) || 'satellite'

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }
    if (!['satellite', 'drone'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let userId: string | undefined
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      userId = decoded.userId
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', type)
    await fs.mkdir(uploadsDir, { recursive: true })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`
    const filePath = path.join(uploadsDir, filename)
    await fs.writeFile(filePath, buffer)

    const image = await prisma.image.create({
      data: {
        type,
        filePath: `/uploads/${type}/${filename}`,
        uploaderId: userId
      }
    })

    // Call Python NDWI
    const fd = new FormData()
    fd.append('file', new Blob([buffer], { type: 'image/png' }), filename)
    const ndwiRes = await fetch('http://localhost:8001/api/analyze/ndwi', { method: 'POST', body: fd })
    const ndwiData = await ndwiRes.json()
    const ndwiB64 = ndwiData.ndwi_image.replace(/^data:image\/png;base64,/, '')
    const ndwiBuffer = Buffer.from(ndwiB64, 'base64')
    const ndwiDir = path.join(process.cwd(), 'public', 'outputs', 'ndwi')
    await fs.mkdir(ndwiDir, { recursive: true })
    const ndwiFilename = `ndwi-${image.id}.png`
    const ndwiPath = path.join(ndwiDir, ndwiFilename)
    await fs.writeFile(ndwiPath, ndwiBuffer)

    // Flow path image (optional call)
    let flowPathFile: string | undefined
    try {
      const flowRes = await fetch('http://localhost:8001/api/flowpath', { method: 'POST', body: fd })
      if (flowRes.ok) {
        const flowData = await flowRes.json()
        const flowB64 = flowData.flow_image.replace(/^data:image\/png;base64,/, '')
        const flowBuffer = Buffer.from(flowB64, 'base64')
        const flowDir = path.join(process.cwd(), 'public', 'outputs', 'flow')
        await fs.mkdir(flowDir, { recursive: true })
        const flowFilename = `flow-${image.id}.png`
        const flowPath = path.join(flowDir, flowFilename)
        await fs.writeFile(flowPath, flowBuffer)
        flowPathFile = `/outputs/flow/${flowFilename}`
      }
    } catch {}

    // Change detection: compare with previous analysis of same type
    const lastAnalysis = await prisma.analysis.findFirst({
      where: { image: { type } },
      orderBy: { createdAt: 'desc' }
    })
    const pastPixels = lastAnalysis?.waterPixels || ndwiData.water_pixels
    const riskRes = await fetch(`http://localhost:8001/api/analyze/risk?water_pixels_current=${ndwiData.water_pixels}&water_pixels_past=${pastPixels}&dist_km=5`, { method: 'POST' })
    const riskJson = await riskRes.json()

    const analysis = await prisma.analysis.create({
      data: {
        imageId: image.id,
        ndwiImagePath: `/outputs/ndwi/${ndwiFilename}`,
        flowPathImagePath: flowPathFile,
        waterPixels: Number(ndwiData.water_pixels),
        volumeEstimateM3: Number(riskJson.change_analysis?.estimated_volume_m3) || null,
        riskLevel: riskJson.risk_assessment?.risk_level || null,
        accuracy: Number(riskJson.accuracy_metrics?.image_quality_score) || null,
        changePercentage: Number(riskJson.change_analysis?.change_percentage) || null,
        comparedImageId: lastAnalysis?.imageId || null
      }
    })

    return NextResponse.json({ success: true, image, analysis })
  } catch (e: any) {
    console.error('Upload error', e)
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 })
  }
}
