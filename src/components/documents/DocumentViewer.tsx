"use client";

import { useRef, useState } from "react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
  label: string;
  hasPdf?: boolean;
}

export default function DocumentViewer({ slug, label, hasPdf = true }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/docs/templates/${slug}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? `${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Silently fail — user will see nothing downloaded
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/60 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/documents")}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-semibold text-foreground">{label}</h1>
        </div>
        {hasPdf && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal/10 text-teal border border-teal/25 hover:bg-teal/20 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download PDF
          </button>
        )}
      </div>

      {/* Document iframe */}
      <div className="flex-1 relative bg-[#dde8e8]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
            <Loader2 className="h-6 w-6 animate-spin text-teal" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={`/docs/${slug}.html`}
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
          title={label}
        />
      </div>
    </div>
  );
}
