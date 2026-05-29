import { useEffect, useState } from 'react'
import { fetchDocuments, downloadUrl } from '../services/documentService'
import { Download, FileText, Loader2, FolderOpen, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const formatSize = (bytes) => {
  if (!bytes) return '-'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = () => {
    setLoading(true)
    setError(false)
    fetchDocuments()
      .then((res) => setDocs(res.data))
      .catch(() => {
        setError(true)
        toast.error('Failed to load documents. Is the server running?')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDownload = (id, originalName) => {
    try {
      const a = document.createElement('a')
      a.href = downloadUrl(id)
      a.download = originalName
      a.click()
    } catch {
      toast.error('Download failed. Please try again.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-53px)] bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Documents</h1>
            {!loading && !error && (
              <p className="text-slate-400 text-sm mt-0.5">{docs.length} file{docs.length !== 1 ? 's' : ''} stored</p>
            )}
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-blue-600
              hover:bg-blue-50 border border-slate-200 bg-white transition-all duration-150 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={32} className="text-blue-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading documents...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
              <FileText size={24} className="text-red-400" />
            </div>
            <p className="text-slate-600 font-medium">Could not load documents</p>
            <button
              onClick={load}
              className="text-sm text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && docs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
              <FolderOpen size={28} className="text-blue-300" />
            </div>
            <p className="text-slate-600 font-medium">No documents yet</p>
            <p className="text-slate-400 text-sm">Upload some PDFs to see them here</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && docs.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['File Name', 'Type', 'Size', 'Upload Date', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors duration-100 group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                          <FileText size={13} className="text-blue-500" />
                        </div>
                        <span className="text-slate-700 font-medium truncate max-w-xs">{doc.originalName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {doc.fileType?.replace('application/', '') ?? '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{formatSize(doc.fileSize)}</td>
                    <td className="px-5 py-3.5 text-slate-500">{formatDate(doc.uploadDate)}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDownload(doc.id, doc.originalName)}
                        className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 font-medium
                          hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all duration-150"
                      >
                        <Download size={13} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
