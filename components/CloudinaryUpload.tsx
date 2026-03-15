"use client";
import { useRef, useState } from "react";
import { Upload, X, CheckCircle, Loader2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  value: string;
  onChange: (url: string, publicId: string) => void;
  onClear: () => void;
  folder?: string;
  label?: string;
  accept?: string;
  maxMb?: number;
  aspectRatio?: string;
}

export default function CloudinaryUpload({
  value,
  onChange,
  onClear,
  folder = "DropSell",
  label = "Upload Image",
  accept = "image/*",
  maxMb = 5,
  aspectRatio = "aspect-square",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      toast.error(`Image must be under ${maxMb}MB`);
      return;
    }

    setUploading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;

      // Fake progress animation
      const ticker = setInterval(() => {
        setProgress((p) => Math.min(p + 12, 85));
      }, 180);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64, folder }),
        });
        const data = await res.json();
        clearInterval(ticker);

        if (res.ok) {
          setProgress(100);
          onChange(data.url, data.public_id);
          toast.success("Image uploaded successfully!");
        } else {
          toast.error(data.error || "Upload failed");
          setProgress(0);
        }
      } catch {
        clearInterval(ticker);
        toast.error("Upload failed");
        setProgress(0);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (value) {
    return (
      <div className={`relative ${aspectRatio} rounded-2xl overflow-hidden border-2 border-brand-200 bg-gray-50 group`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={onClear}
            className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-2 right-2">
          <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`w-full ${aspectRatio} border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all disabled:cursor-not-allowed
          ${uploading
            ? "border-brand-300 bg-brand-50"
            : "border-gray-300 hover:border-brand-400 hover:bg-brand-50 bg-gray-50"
          }`}
      >
        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            <p className="text-sm font-semibold text-brand-600">Uploading... {progress}%</p>
            <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                JPG, PNG, WEBP up to {maxMb}MB
              </p>
            </div>
          </>
        )}
      </button>
    </>
  );
}
