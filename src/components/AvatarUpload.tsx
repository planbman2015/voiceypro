import { useState, useRef, useCallback } from 'react';
import { Upload, Link2, X, ImageIcon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type Mode = 'upload' | 'url';

type Props = {
  value: string;
  onChange: (url: string) => void;
};

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXT = '.jpg, .jpeg, .png, .webp';

export default function AvatarUpload({ value, onChange }: Props) {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>('upload');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [urlInput, setUrlInput] = useState(value.startsWith('http') ? value : '');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploadError('');

    if (!ALLOWED.includes(file.type)) {
      setUploadError('Only JPG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError('File must be under 2 MB.');
      return;
    }

    if (!user) {
      setUploadError('You must be signed in to upload a photo.');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      setUploadError(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [user]);

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function applyUrl() {
    const trimmed = urlInput.trim();
    if (trimmed) onChange(trimmed);
  }

  function clearPhoto() {
    onChange('');
    setUrlInput('');
    setUploadError('');
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-slate-300 text-sm font-medium">Profile Photo</label>
        {/* Mode toggle */}
        <div className="flex gap-1 p-0.5 bg-slate-800 border border-slate-700 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${mode === 'upload' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Upload size={11} /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${mode === 'url' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Link2 size={11} /> Paste URL
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {/* Preview */}
        <div className="flex-shrink-0 relative">
          {value ? (
            <>
              <img
                src={value}
                alt="Avatar preview"
                className="w-20 h-20 rounded-xl object-cover ring-2 ring-slate-700"
                onError={() => { onChange(''); setUploadError('Could not load image from that URL.'); }}
              />
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition-colors shadow"
              >
                <X size={10} />
              </button>
            </>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center">
              <ImageIcon size={22} className="text-slate-600" />
            </div>
          )}
        </div>

        {/* Upload / URL panel */}
        <div className="flex-1 min-w-0">
          {mode === 'upload' ? (
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={() => setDragging(false)}
              onClick={() => fileRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed px-4 py-5 text-center transition-all ${
                dragging
                  ? 'border-sky-400 bg-sky-500/10'
                  : 'border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800/60'
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept={ALLOWED_EXT}
                onChange={onFileInput}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={20} className="text-sky-400 animate-spin" />
                  <p className="text-sky-400 text-xs font-medium">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <Upload size={18} className="text-slate-500" />
                  <p className="text-slate-300 text-xs font-medium">
                    Drop photo here or <span className="text-sky-400">browse</span>
                  </p>
                  <p className="text-slate-600 text-xs">JPG, PNG, WebP — max 2 MB — 500×500 px min</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onBlur={applyUrl}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyUrl())}
                placeholder="https://example.com/headshot.jpg"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition-all"
              />
              <button
                type="button"
                onClick={applyUrl}
                className="px-3 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-colors flex-shrink-0"
              >
                Apply
              </button>
            </div>
          )}

          {uploadError && (
            <div className="flex items-center gap-1.5 mt-2">
              <AlertCircle size={12} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs">{uploadError}</p>
            </div>
          )}

          {value && !uploadError && (
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-400 text-xs">Photo set — looks great!</p>
            </div>
          )}

          {/* Spec summary shown only in upload mode */}
          {mode === 'upload' && !value && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { label: 'Min size', value: '500×500 px' },
                { label: 'Ideal size', value: '1000×1000 px' },
                { label: 'Max file', value: '2 MB' },
                { label: 'Formats', value: 'JPG · PNG · WebP' },
              ].map(({ label, value: v }) => (
                <div key={label} className="flex justify-between px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <span className="text-slate-500 text-xs">{label}</span>
                  <span className="text-slate-300 text-xs font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
