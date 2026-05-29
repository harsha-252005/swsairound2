import { supabase } from './_supabase.js'
import formidable from 'formidable'
import fs from 'fs'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const form = formidable({ multiples: true, maxFileSize: 50 * 1024 * 1024 })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Failed to parse files' })

    const uploaded = Array.isArray(files.files) ? files.files : [files.files]
    const results = []

    for (const file of uploaded) {
      const buffer = fs.readFileSync(file.filepath)
      const fileName = `${Date.now()}_${file.originalFilename}`

      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(fileName, buffer, { contentType: file.mimetype })

      if (storageError) {
        return res.status(500).json({ error: storageError.message })
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      const { data, error: dbError } = await supabase
        .from('documents')
        .insert({
          file_name: fileName,
          original_name: file.originalFilename,
          file_size: file.size,
          file_type: file.mimetype,
          file_path: publicUrl,
          status: 'UPLOADED',
        })
        .select()
        .single()

      if (dbError) return res.status(500).json({ error: dbError.message })
      results.push(data)
    }

    // trigger notification if more than 3 files
    if (uploaded.length > 3) {
      await supabase.from('notifications').insert({
        message: `${uploaded.length} files uploaded successfully`,
        type: 'UPLOAD',
        read: false,
      })
    }

    return res.status(200).json(results)
  })
}
