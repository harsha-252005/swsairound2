import axios from 'axios'

const BASE = '/api'

export const uploadDocuments = (files, onProgress) => {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))
  return axios.post(`${BASE}/upload`, form, {
    onUploadProgress: (e) => onProgress(Math.round((e.loaded * 100) / e.total)),
  })
}

export const fetchDocuments = () => axios.get(`${BASE}/documents`)

export const downloadUrl = (filePath) => filePath
