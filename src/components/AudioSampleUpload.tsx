import { useState, useRef, useCallback } from 'react';
import { Upload, X, Music, Loader2, AlertCircle, CheckCircle2, Play, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type Props = {
  value: string;
  onChange: (url: string) => void;
};

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-wav', 'audio/wave'];
const ALLOWED_EXT = '.mp3, .wav, .ogg, .m4a';

export default function AudioSampleUpload({ value, onChange }: Props) {
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [playing, setPlaying] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  async function handleFile(file: File) {
    setUploadError('');

    const isAllowed = ALLOWED_TYPES.includes(file.type) || file.name.match(/\.(mp3|wav|ogg|m4a)$/i);
    if (!isAllowed) {
      setUploadError('Only MP3, WAV, OGG, or M4A audio files are allowed.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError('Audio file must be under 10 MB.');
      return;
    }
    if (!user) {
      setUploadError('You must be signed in to upload audio.');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('voice-samples')
      .upload(path, file, { upsert: true, contentType: file.type || 'audio/mpeg' });

    if (error) {
      setUploadError(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('voice-samples').getPublicUrl(path);
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

  function clearSample() {
    setPlaying(false);
    audioRef.current?.pause();
    onChange('');
    setUploadError('');
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-slate-300 text-sm font-medium">
          Demo Audio Sample <span className="text-slate-500 font-normal">(optional)</span>
        </label>
      </div>

      {value ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/30">
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center flex-shrink-0 transition-colors shadow-lg shadow-sky-500/20"
          >
            {playing ? <Pause size={15} className="text-white" /> : <Play size={15} className="text-white ml-0.5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-emerald-400 text-xs font-medium flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Audio sample uploaded
            </p>
            <p className="text-slate-500 text-xs truncate">{value.split('/').pop()}</p>
          </div>
          <button
            type="button"
            onClick={clearSample}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center flex-shrink-0 transition-all"
          >
            <X size={12} />
          </button>
          <audio
            ref={audioRef}
            src={value}
            onEnded={() => setPlaying(false)}
            preload="metadata"
          />
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all ${
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
              <Loader2 size={22} className="text-sky-400 animate-spin" />
              <p className="text-sky-400 text-xs font-medium">Uploading audio...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-1">
                <Music size={18} className="text-slate-500" />
              </div>
              <p className="text-slate-300 text-xs font-medium">
                Drop audio here or <span className="text-sky-400">browse</span>
              </p>
              <p className="text-slate-600 text-xs">MP3, WAV, OGG, M4A — max 10 MB — 30–90 sec recommended</p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1.5">
          <AlertCircle size={12} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-xs">{uploadError}</p>
        </div>
      )}

      <p className="text-slate-500 text-xs">
        Upload a 30–90 second sample showcasing your voice. Clients can preview it before reaching out.
      </p>
    </div>
  );
}
