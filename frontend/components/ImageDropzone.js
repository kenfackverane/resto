import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageDropzone({ file, setFile, previewUrl, progress }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="w-full mt-2">
      <div
        {...getRootProps()}
        className={`w-full rounded-xl border border-white/15 p-4 cursor-pointer transition ${
          isDragActive ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-green-50 font-semibold">
          {isDragActive
            ? "Drop image here..."
            : "Drag & drop image or click to choose"}
        </p>
        <p className="text-green-100/70 text-sm mt-1">
          {file?.name || "PNG, JPG, WEBP"}
        </p>
      </div>

      {previewUrl ? (
        <img
          src={previewUrl}
          alt="preview"
          className="mt-3 h-28 w-28 object-cover rounded-2xl border border-white/10"
        />
      ) : null}

      {typeof progress === "number" ? (
        <div className="mt-3">
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-green-100/70 mt-1">{progress}%</p>
        </div>
      ) : null}
    </div>
  );
}