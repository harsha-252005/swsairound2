import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadDocuments } from '../services/documentService'
import { FileText, UploadCloud, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS = { PENDING: 'Pending', UPLOADING: 'Uploading', COMPLETED: 'Completed', FAILED: 'Failed' }
const MAX_SIZE = 50 * 1024 * 1024 // 50MB

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const StatusIcon = ({ status }) => {
  if (status === STATUS.UPLOADING) return <Loader2 size={15} className="text-blue-500 animate-spin" />
  if (status === STATUS.COMPLETED) return <CheckCircle size={15} className="text-emerald-500" />
  if (status === STATUS.FAILED) return <XCircle size={15} className="text-red-500" />
  return <FileText size={15} className="text-blue-400" />
}

const statusStyles = {
  [STATUS.PENDING]:   { text: 'text-slate-400',   bar: 'bg-slate-200',   badge: 'bg-slate-100 text-slate-500' },
  [STATUS.UPLOADING]: { text: 'text-blue-500',     bar: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-600' },
  [STATUS.COMPLETED]: { text: 'text-emerald-600',  bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-600' },
  [STATUS.FAILED]:    { text: 'text-red-500',      bar: 'bg-red-500',     badge: 'bg-red-50 text-red-600' },
}

export default function FileUpload() {
  const [fileItems, setFileItems] = useState([])

  const onDrop = useCallback((accepted, rejected) => {
    // Handle rejected files
    rejected.forEach(({ file, errors }) => {
      errors.forEach((e) => {
        if (e.code === 'file-invalid-type') toast.error(`"${file.name}" is not a PDF`)
        else if (e.code === 'file-too-large') toast.error(`"${file.name}" exceeds 50MB limit`)
        else toast.error(`"${file.name}": ${e.message}`)
      })
    })
    if (accepted.length) {
      setFileItems((prev) => [...prev, ...accepted.map((file) => ({ file, progress: 0, status: STATUS.PENDING }))])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    maxSize: MAX_SIZE,
  })

  const remove = (index) => setFileItems((prev) => prev.filter((_, i) => i !== index))

  const handleUpload = async () => {
    const pending = fileItems.filter((i) => i.status === STATUS.PENDING)
    if (!pending.length) { toast.error('No pending files to upload'); return }

    setFileItems((prev) =>
      prev.map((item) => item.status === STATUS.PENDING ? { ...item, status: STATUS.UPLOADING } : item)
    )

    try {
      await uploadDocuments(
        pending.map((i) => i.file),
        (progress) =>
          setFileItems((prev) =>
            prev.map((item) => item.status === STATUS.UPLOADING ? { ...item, progress } : item)
          )
      )
      setFileItems((prev) =>
        prev.map((item) => item.status === STATUS.UPLOADING ? { ...item, status: STATUS.COMPLETED, progress: 100 } : item)
      )
      toast.success(`${pending.length} file${pending.length > 1 ? 's' : ''} uploaded successfully!`)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Upload failed. Please try again.'
      setFileItems((prev) =>
        prev.map((item) => item.status === STATUS.UPLOADING ? { ...item, status: STATUS.FAILED } : item)
      )
      toast.error(msg)
    }
  }

  const clearDone = () =>
    setFileItems((prev) => prev.filter((i) => i.status !== STATUS.COMPLETED && i.status !== STATUS.FAILED))

  const hasPending = fileItems.some((i) => i.status === STATUS.PENDING)
  const hasDone = fileItems.some((i) => i.status === STATUS.COMPLETED || i.status === STATUS.FAILED)

  return (
    <div className="min-h-[calc(100vh-53px)] bg-slate-50 flex items-start justify-center p-6 pt-10">
      <div className="w-full max-w-2xl space-y-4">

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-slate-800">Upload Documents</h1>
          <p className="text-slate-500 text-sm mt-0.5">PDF files only · Max 50MB per file</p>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 select-none
            ${isDragReject
              ? 'border-red-400 bg-red-50'
              : isDragActive
              ? 'border-blue-400 bg-blue-50 scale-[1.01]'
              : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 shadow-sm'
            }`}
        >
          <input {...getInputProps()} />
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-200
            ${isDragReject ? 'bg-red-100' : isDragActive ? 'bg-blue-100' : 'bg-blue-50'}`}>
            <UploadCloud size={26} className={isDragReject ? 'text-red-500' : isDragActive ? 'text-blue-500' : 'text-blue-400'} />
          </div>
          <p className="font-semibold text-slate-700 text-base">
            {isDragReject ? 'Only PDF files are accepted' : isDragActive ? 'Release to add files' : 'Drag & drop PDF files here'}
          </p>
          <p className="text-slate-400 text-sm mt-1">or <span className="text-blue-500 font-medium">click to browse</span></p>
        </div>

        {/* File List */}
        {fileItems.length > 0 && (
          <div className="space-y-2">
            {fileItems.map((item, i) => {
              const s = statusStyles[item.status]
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <StatusIcon status={item.status} />
                      <span className="text-slate-700 text-sm font-medium truncate">{item.file.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-slate-400 text-xs">{formatSize(item.file.size)}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{item.status}</span>
                      <span className="text-slate-400 text-xs w-7 text-right">{item.progress}%</span>
                      {item.status === STATUS.PENDING && (
                        <button onClick={() => remove(i)} className="text-slate-300 hover:text-red-400 transition-colors ml-1">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${s.bar} ${item.status === STATUS.UPLOADING ? 'animate-pulse' : ''}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleUpload}
            disabled={!hasPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400
              text-white font-semibold py-3 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md disabled:shadow-none"
          >
            Upload Files
          </button>
          {hasDone && (
            <button
              onClick={clearDone}
              className="px-5 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-600
                font-medium py-3 rounded-xl transition-all duration-150 shadow-sm"
            >
              Clear Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
