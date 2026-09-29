import { useState } from "react";
import { FiFile, FiUploadCloud, FiX } from "react-icons/fi";

const MAX_SIZE = 3 * 1024 * 1024;

const formatSize = (bytes) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const ResumeDrop = ({ file, onChange, onError }) => {
  const [dragOver, setDragOver] = useState(false);

  const selectFile = (selected) => {
    if (!selected) return;
    if (selected.type !== "application/pdf") return onError("Upload your resume as a PDF file.");
    if (selected.size > MAX_SIZE) return onError("Resume must be 3 MB or smaller.");
    onError("");
    onChange(selected);
  };

  if (file) {
    return (
      <div className="file-drop has-file">
        <FiFile className="file-icon" size={22} />
        <div className="file-info">
          <p className="file-name">{file.name}</p>
          <p className="file-size">{formatSize(file.size)}</p>
        </div>
        <button type="button" className="file-remove" aria-label="Remove file" onClick={() => onChange(null)}>
          <FiX size={16} />
        </button>
      </div>
    );
  }

  return (
    <label
      className={`file-drop ${dragOver ? "is-dragover" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        selectFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        type="file"
        accept="application/pdf,.pdf"
        onChange={(e) => {
          selectFile(e.target.files[0]);
          e.target.value = "";
        }}
      />
      <FiUploadCloud className="drop-icon" size={26} />
      <p className="drop-title">Drop your PDF here or click to browse</p>
      <p className="drop-hint">PDF only, up to 3 MB</p>
    </label>
  );
};

export default ResumeDrop;