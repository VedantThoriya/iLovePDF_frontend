import {
  ArrowLeft,
  Download,
  Trash,
  Facebook,
  Twitter,
  Linkedin,
  Files,
  Scissors,
  ChevronRight,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useJobStore } from "@/store/useJobStore";

export const DownloadPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useJobStore();

  const downloadUrl = location.state?.downloadUrl;
  const tool = location.state?.tool || "merge";
  const originalSize = location.state?.originalSize || 0;
  const navigationType = useNavigationType();

  const [compressedSize, setCompressedSize] = useState(
    location.state?.compressedSize || 0
  );

  /**
   * HISTORY GUARD
   * - Removes /download from browser history
   * - Back button goes directly to tool page
   */
  useEffect(() => {
    // 1️⃣ Block direct access (refresh / new tab / deep link)
    if (!downloadUrl) {
      navigate(`/${tool}`, { replace: true });
      return;
    }

    // 2️⃣ Block back/forward (POP) navigation into download page
    if (navigationType === "POP") {
      navigate(`/${tool}`, { replace: true });
    }
  }, [downloadUrl, navigationType, tool, navigate]);

  /**
   * Fetch compressed size if missing
   */
  useEffect(() => {
    if (downloadUrl && compressedSize === 0 && tool === "compress") {
      fetch(downloadUrl, { method: "HEAD" })
        .then((res) => {
          const size = res.headers.get("content-length");
          if (size) setCompressedSize(parseInt(size, 10));
        })
        .catch(() => {});
    }
  }, [downloadUrl, compressedSize, tool]);

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getToolText = (toolType: string) => {
    switch (toolType) {
      case "compress":
        return {
          title: "PDF files have been compressed!",
          buttonText: "Download compressed PDFs",
        };
      case "split":
        return {
          title: "PDFs have been split!",
          buttonText: "Download split PDF",
        };
      case "protect":
        return {
          title: "PDF file has been protected!",
          buttonText: "Download protected PDF",
        };
      case "unlock":
        return {
          title: "PDF has been unlocked!",
          buttonText: "Download unlocked PDF",
        };
      case "merge":
        return {
          title: "PDF files have been merged!",
          buttonText: "Download merged PDFs",
        };
      default:
        return {
          title: "PDF files have been processed!",
          buttonText: "Download processed PDFs",
        };
    }
  };

  const text = getToolText(tool);

  const handleDownload = async () => {
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download =
        downloadUrl.split("/").pop()?.split("?")[0] || `${tool}-result.pdf`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.location.href = downloadUrl;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 pt-12 pb-20 px-4 text-[#383E45]">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        {text.title}
      </h1>

      {/* ACTIONS */}
      <div className="w-full max-w-md md:max-w-3xl mb-8 grid grid-cols-2 md:flex md:items-center md:justify-center gap-4">
        {/* Download Button (Mobile: Top, Desktop: Middle) */}
        <button
          onClick={handleDownload}
          className="col-span-2 md:w-auto md:min-w-[300px] order-1 md:order-2 flex items-center justify-center gap-3 bg-[#2C7A7B] hover:bg-[#236363] text-white text-lg md:text-xl font-bold py-4 px-8 rounded-xl shadow-sm transition-all active:scale-[0.98]"
        >
          <Download size={24} />
          {text.buttonText}
        </button>

        {/* Back Button (Mobile: Bottom Left, Desktop: Left) */}
        <Link
          to={`/${tool}`}
          replace
          className="justify-self-start order-2 md:order-1 w-10 h-10 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-[#383E45] text-white hover:bg-[#2c3137] transition-colors"
          title="Back"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Trash Button (Mobile: Bottom Right, Desktop: Right) */}
        <button
          onClick={() => {
            reset();
            navigate(`/${tool}`, { replace: true });
          }}
          className="justify-self-end order-3 md:order-3 w-10 h-10 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-[#383E45] text-white hover:bg-[#E5322D] transition-colors"
          title="Delete"
        >
          <Trash size={18} />
        </button>
      </div>

      {/* COMPRESSION SUMMARY */}
      {tool === "compress" && originalSize > 0 && compressedSize > 0 && (
        <div className="flex gap-6 mb-12">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke="#eee"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke="#E5322D"
                strokeWidth="8"
                fill="none"
                strokeDasharray={263.9}
                strokeDashoffset={
                  263.9 -
                  263.9 * ((originalSize - compressedSize) / originalSize)
                }
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">
                {Math.round(
                  ((originalSize - compressedSize) / originalSize) * 100
                )}
                %
              </span>
              <span className="text-xs uppercase font-bold">Saved</span>
            </div>
          </div>

          <div>
            <p className="text-gray-500">Your PDF is now smaller</p>
            <p className="font-bold text-lg">
              {formatSize(originalSize)} → {formatSize(compressedSize)}
            </p>
          </div>
        </div>
      )}

      {/* CONTINUE */}
      <div className="w-full max-w-md md:max-w-4xl bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
        <h3 className="text-lg md:text-xl font-bold mb-6 text-[#383E45]">
          Continue to...
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/compress"
            replace
            className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all group"
          >
            <div className="w-10 h-10 bg-[#e7f5ea] text-[#00b96b] flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
              <Files size={20} />
            </div>
            <span className="font-semibold text-gray-700">Compress PDF</span>
            <ChevronRight
              className="ml-auto text-gray-400 group-hover:text-gray-600"
              size={20}
            />
          </Link>

          <Link
            to="/split"
            replace
            className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all group"
          >
            <div className="w-10 h-10 bg-[#fff0e0] text-[#ff9900] flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
              <Scissors size={20} />
            </div>
            <span className="font-semibold text-gray-700">Split PDF</span>
            <ChevronRight
              className="ml-auto text-gray-400 group-hover:text-gray-600"
              size={20}
            />
          </Link>

          <Link
            to="/merge"
            replace
            className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all group"
          >
            <div className="w-10 h-10 bg-[#fdeeee] text-[#e5322d] flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
              <Files size={20} />
            </div>
            <span className="font-semibold text-gray-700">Merge PDF</span>
            <ChevronRight
              className="ml-auto text-gray-400 group-hover:text-gray-600"
              size={20}
            />
          </Link>
        </div>
      </div>

      {/* SOCIAL */}
      <div className="mt-10 text-center">
        <h4 className="font-bold mb-2">Spread the word!</h4>
        <div className="flex gap-3 justify-center">
          <Facebook />
          <Twitter />
          <Linkedin />
        </div>
      </div>
    </div>
  );
};
