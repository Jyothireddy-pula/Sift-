import { useCallback, useRef, useState } from "react";
import { IconAlert, IconFile, IconUpload } from "./Icons";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadZone({ onFileAccepted, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const validateAndSet = useCallback(
    (candidate) => {
      if (!candidate) return;
      setError("");

      const typeOk =
        ACCEPTED_TYPES.includes(candidate.type) ||
        /\.(pdf|png|jpe?g|webp)$/i.test(candidate.name);

      if (!typeOk) {
        setError("Unsupported file type. Please upload a PDF or an image (PNG, JPG, WEBP).");
        return;
      }
      if (candidate.size > MAX_SIZE_BYTES) {
        setError(`File is too large (${formatBytes(candidate.size)}). Max allowed size is 10 MB.`);
        return;
      }

      setFile(candidate);
      onFileAccepted(candidate);
    },
    [onFileAccepted]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const dropped = e.dataTransfer.files?.[0];
    validateAndSet(dropped);
  };

  const handlePick = (e) => {
    const picked = e.target.files?.[0];
    validateAndSet(picked);
    e.target.value = "";
  };

  const handleChangeFile = (e) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label="Upload a PDF or image document"
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`card-3d panel-corner relative rounded-xl border border-dashed p-10 text-center transition-all
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          ${isDragging ? "border-accent bg-accent/[0.05] scale-[1.005]" : "border-white/[0.14] hover:border-white/25 hover:bg-white/[0.015]"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/webp"
          onChange={handlePick}
          className="hidden"
          disabled={disabled}
        />

        <div
          className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 transition-transform duration-300
            ${isDragging ? "scale-110" : ""}
          `}
        >
          <IconUpload className="h-5 w-5 text-accent" />
        </div>

        <p className="font-display text-base font-semibold text-white">
          {isDragging ? "Drop it right here" : "Drag & drop your document"}
        </p>
        <p className="mt-1.5 font-mono text-[12.5px] text-white/40">
          or click to browse &nbsp;·&nbsp; PDF / PNG / JPG / WEBP &nbsp;·&nbsp; 10 MB max
        </p>

        {file && !error && (
          <div className="animate-fadeUp mt-5 inline-flex items-center gap-2.5 rounded-lg glass px-4 py-2 text-sm text-white/80">
            <IconFile className="h-4 w-4 flex-shrink-0 text-accent" />
            <span className="max-w-[220px] truncate font-medium">{file.name}</span>
            <span className="whitespace-nowrap font-mono text-[11px] text-white/35">· {formatBytes(file.size)}</span>
            {!disabled && (
              <button
                onClick={handleChangeFile}
                className="ml-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                Change
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="animate-fadeUp mt-3 flex items-start gap-2.5 rounded-lg border border-red-400/25 bg-red-500/[0.07] px-4 py-2.5 text-sm text-red-200">
          <IconAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
