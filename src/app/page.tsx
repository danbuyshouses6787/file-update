'use client';

import { useState, DragEvent, ChangeEvent } from 'react';

interface FileState {
  file: File;
  status: 'idle' | 'uploading' | 'done';
}

export default function Home() {
  const [state, setState] = useState<FileState | null>(null);

  const upload = async (file: File) => {
    setState({ file, status: 'uploading' });
    const data = new FormData();
    data.append('file', file);
    await fetch('/api/upload', { method: 'POST', body: data });
    setState({ file, status: 'done' });
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <main style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <div
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <input type="file" accept=".csv,.xlsx" onChange={onChange} />
          <p>Drag and drop a file, or click to select</p>
        </div>
        {state && (
          <div className="file-info">
            {state.file.name} ({(state.file.size / 1024).toFixed(1)} KB)
            <span className="status">
              {state.status === 'uploading' ? 'Uploading…' : 'Done'}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
