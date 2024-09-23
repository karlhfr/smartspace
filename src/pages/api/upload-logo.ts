import { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '@/lib/firebase-admin'
import { v4 as uuidv4 } from 'uuid'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { fitterId, file } = req.body

    if (!fitterId || !file) {
      return res.status(400).json({ error: 'Missing fitterId or file' })
    }

    const fileBuffer = Buffer.from(file.split(',')[1], 'base64')
    const fileName = `${fitterId}_${uuidv4()}.jpg`

    const bucket = storage.bucket()
    const fileUpload = bucket.file(`fitter-logos/${fileName}`)

    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
    })

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    })

    res.status(200).json({ url })
  } catch (error) {
    console.error('Error uploading file:', error)
    res.status(500).json({ error: 'Error uploading file' })
  }
}