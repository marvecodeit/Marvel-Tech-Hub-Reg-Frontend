import { useSearchParams } from "react-router-dom";
import { Download, ExternalLink, FileText } from "lucide-react";

export default function ResumeViewer() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");
  const mimeType = searchParams.get("type") || "";

  const isPdf = mimeType === "application/pdf" || /\.pdf($|\?)/i.test(url || "");

  // For PDF: use fl_attachment:false to force inline serving from Cloudinary
  const pdfUrl = isPdf ? url.replace("/raw/upload/", "/raw/upload/fl_attachment:false/") : url;

  // For DOCX: Google Docs Viewer fetches server-side — no CORS
  const docxViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  if (!url) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <p className="text-slate-400">No resume URL provided.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050816] flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0a0f1e] border-b border-white/10 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span className="text-white font-semibold text-sm">Resume Viewer</span>
          <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            {isPdf ? "PDF" : "DOCX"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white text-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Original
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 overflow-hidden">
        {isPdf ? (
          <iframe
            src={pdfUrl}
            title="Resume PDF"
            className="w-full border-0 block"
            style={{ height: "calc(100vh - 53px)", overflow: "auto" }}
          />
        ) : (
          <iframe
            src={docxViewerUrl}
            title="Resume DOCX"
            className="w-full border-0 block"
            style={{ height: "calc(100vh - 53px)", overflow: "auto" }}
          />
        )}
      </div>
    </div>
  );
}
