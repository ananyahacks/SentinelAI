import { useCallback, useRef, useState } from 'react'
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
// import axiosClient from '../api/axiosClient.js'

export default function UploadLogs() {
  const inputRef = useRef(null)

  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)

  const addFiles = (fileList) => {
    const arr = Array.from(fileList).map((f) => ({
      file: f,
      name: f.name,
      size:
        f.size > 1024 * 1024
          ? `${(f.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(f.size / 1024).toFixed(1)} KB`,
      id: `${f.name}-${f.size}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
    }))

    setFiles((prev) => [...prev, ...arr])
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)

    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files)
    }
  }, [])

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const runPipeline = async () => {
    if (!files.length) return

    setProcessing(true)
    setDone(false)

    // const formData = new FormData()
    // files.forEach(f => formData.append("logs", f.file))
    // await axiosClient.post("/logs/upload", formData)

    await new Promise((r) => setTimeout(r, 1500))

    setProcessing(false)
    setDone(true)
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-8">
      <div className="card w-full rounded-2xl p-8 shadow-lg">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-small text-white">
            Feed the Detection Pipeline
          </h2>

          <p className="mt-1 text-base text-white">
            Upload raw activity logs (CSV, JSON, LOG or TXT) for behavioral
            analysis.
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            min-h-[280px]
            rounded-2xl
            border-2
            border-dashed
            transition-all
            cursor-pointer
            flex
            flex-col
            items-center
            justify-center
            px-8
            text-center
            ${
              dragOver
                ? 'border-signal bg-signal/5'
                : 'border-hairline hover:border-faint'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            multiple
            accept=".csv,.json,.log,.txt"
            onChange={(e) =>
              e.target.files && addFiles(e.target.files)
            }
          />

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated2">
            <UploadCloud size={25} className="text-signal" />
          </div>

          <h3 className="text-lg font-white text-ink">
            Drag & Drop Log Files
          </h3>

          <p className="mt-2 text-sm text-grey">
            or click anywhere to browse
          </p>

          <p className="mt-1 text-xs text-grey">
            Supports .csv, .json, .log and .txt files (Max 200MB each)
          </p>
        </div>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="mt-8 space-y-3">
            <h4 className="text-sm font-semibold text-ink">
              Selected Files
            </h4>

            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 rounded-xl border border-hairline bg-elevated px-4 py-3"
              >
                <FileText
                  size={18}
                  className="text-signal shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {file.name}
                  </p>
                </div>

                <span className="text-xs font-mono text-faint">
                  {file.size}
                </span>

                <button
                  onClick={() => removeFile(file.id)}
                  className="text-faint transition hover:text-risk-critical"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action */}
        <div className="mt-10 flex flex-col items-center gap-4">

          <button
            onClick={runPipeline}
            disabled={!files.length || processing}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-signal
              px-8
              py-3
              text-sm
              font-semibold
              text-oninverse
              transition
              hover:bg-signal-dim
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {processing ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Processing...
              </>
            ) : (
              <>
                <UploadCloud size={18} />
                Run Detection Pipeline
              </>
            )}
          </button>

          {done && (
            <div className="flex items-center gap-2 rounded-lg border border-signal/20 bg-signal/10 px-4 py-3 text-sm font-medium text-signal">
              <CheckCircle2 size={18} />
              Pipeline completed successfully. Risk scores have been updated.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
