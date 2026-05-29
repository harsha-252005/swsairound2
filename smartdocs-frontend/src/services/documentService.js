import axios from 'axios'

const BASE = `${import.meta.env.VITE_API_URL}/api/documents`

export const uploadDocuments = (files, onProgress) => {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))
  return axios.post(`${BASE}/upload`, form, {
    onUploadProgress: (e) => onProgress(Math.round((e.loaded * 100) / e.total)),
  })
}

export const fetchDocuments = () => axios.get(BASE)

export const downloadUrl = (id) => `${BASE}/download/${id}`
