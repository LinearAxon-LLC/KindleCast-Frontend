import React from "react";
import { useEffect, useRef, useState } from "react";
import ePub, { Rendition, Book, Contents } from "epubjs";
import { Libre_Baskerville } from "next/font/google";
import { API_CONFIG } from "@/types/api";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

interface KindleReaderProps {
  url: string;
  urlError: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  preview_path: string;
}

export default function KindleReaderHome({
  url,
  urlError,
  isLoading,
  isSuccess,
  error,
  preview_path,
}: KindleReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const bookRef = useRef<Book | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("Quick Send");
  const [customPrompt, setCustomPrompt] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const demoLinks = [
    "https://www.reddit.com/r/startups/comments/...",
    "https://medium.com/@maddiewang/how-to-build...",
    "https://www.ycombinator.com/library/8g-how-to...",
    "https://en.wikipedia.org/wiki/Startup_company",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const loadBook = async () => {
      try {
        if (renditionRef.current) {
          renditionRef.current.destroy();
          renditionRef.current = null;
        }
        bookRef.current = null;

        const formatToEpub: Record<string, string> = {
          "Quick Send": "/epubs/quick.epub",
          Summarize: "/epubs/summarize.epub",
          "Study Guide": "/epubs/study.epub",
          Custom: "/epubs/custom.epub",
        };

        const epubPath = formatToEpub[selectedFormat] || "/epubs/quick.epub";
        const book = ePub(epubPath);
        bookRef.current = book;

        const rendition = book.renderTo(viewerRef.current as HTMLElement, {
          width: "100%",
          height: "100%",
          spread: "none",
          flow: "scrolled-doc",
        });

        rendition.hooks.content.register((contents: Contents) => {
          const fontFaceRules = {
            "@font-face": [
              {
                "font-family": "LibreBaskerville",
                src: "url('/fonts/LibreBaskerville-Regular.ttf') format('truetype')",
                "font-weight": "400",
                "font-style": "normal",
              },
              {
                "font-family": "LibreBaskerville",
                src: "url('/fonts/LibreBaskerville-Bold.ttf') format('truetype')",
                "font-weight": "700",
                "font-style": "normal",
              },
            ],
          };
          contents.addStylesheetRules(fontFaceRules, "libre-baskerville-font");
        });

        await rendition.display();

        rendition.themes.default({
          "*": {
            "font-family": "LibreBaskerville, Georgia, serif",
            color: "#2e2e2eff !important",
          },
          p: { "font-size": "14px" },
          span: { "font-size": "14px" },
          div: { "font-size": "14px" },
          h1: { "font-size": "20px" },
          h2: { "font-size": "16px" },
          h3: { "font-size": "14px" },
          li: { "font-size": "14px" },
          a: {
            color: "#4a4a4aff !important",
            "text-decoration": "none",
            "font-size": "14px",
          },
          img: {
            filter: "grayscale(100%)",
            "max-width": "100%",
            height: "auto",
            display: "block",
            margin: "0 auto !important",
          },
        });

        rendition.on("rendered", () => {
          rendition.themes.select("kindle");
        });

        renditionRef.current = rendition;

        interval = setInterval(() => {
          const rendition = renditionRef.current;
          if (!rendition) return;

          rendition.next();
        }, 1000);
      } catch (err) {
        console.error("Failed to load book:", err);
      }
    };

    loadBook();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedFormat]);

  useEffect(() => {
    let linkIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const interval = setInterval(() => {
      const currentLink = demoLinks[linkIndex];

      if (!deleting) {
        setUrlInput(currentLink.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentLink.length) {
          deleting = true;
          setTimeout(() => {}, 1000);
        }
      } else {
        setUrlInput(currentLink.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          linkIndex = (linkIndex + 1) % demoLinks.length;
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-between my-1">
      <div className="w-full flex items-center justify-center max-w-4xl mx-auto mb-6 sm:mb-8 mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-6">
        <div className="w-full sm:w-4/5 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)] p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <input
                  type="text"
                  value={urlInput}
                  className="border-brand-primary/80 border-2 ring-2 ring-brand-primary/20 w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-black/[0.03] rounded-[8px] text-[15px] sm:text-[16px] text-black/85 placeholder:text-black/40 focus:bg-white focus:outline-none transition-all duration-200 cursor-text"
                  disabled
                />
              </div>

              <div>
                <label className="text-[13px] sm:text-[14px] font-medium text-black/60 uppercase tracking-[0.4px] mb-3 sm:mb-4 block text-center">
                  Choose your format:
                </label>

                <div className="flex gap-2 sm:gap-2.5 flex-wrap justify-center">
                  {["Quick Send", "Summarize", "Study Guide", "Custom"].map(
                    (format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => setSelectedFormat(format)}
                        className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-[8px] text-[13px] sm:text-[14px] font-medium transition-all duration-150 active:scale-[0.95] cursor-pointer ${
                          selectedFormat === format
                            ? "bg-brand-primary text-white shadow-sm"
                            : "bg-black/[0.04] hover:bg-black/[0.08] text-black/70 border border-black/[0.06]"
                        }`}
                        disabled={isLoading}
                      >
                        {format}
                      </button>
                    )
                  )}
                </div>
              </div>

              {selectedFormat === "Custom" && (
                <div>
                  <label className="text-[13px] sm:text-[14px] font-medium text-black/60 mb-2 block">
                    Custom Description:
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., 'make me a business playbook from this link'"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/[0.03] border rounded-[8px] text-[14px] sm:text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:outline-none transition-all duration-200 resize-none cursor-text border-black/[0.08] focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
          <div className="w-full lg:flex-[7] flex justify-center items-center py-5">
            <div className="w-full max-w-md lg:max-w-none relative bg-[#f1f1f1] rounded-lg border border-gray-400 h-[50vh] sm:h-[60vh] lg:h-[75vh] shadow-2xl flex flex-col">
              <div className="w-full flex items-center justify-between bg-[#e5e5e5] border-b border-gray-300 px-4 h-10 rounded-t-lg">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 flex justify-start items-start ml-2">
                  <div className="bg-white px-3 py-1 rounded-t text-xs text-gray-600 border-l border-t border-r border-gray-300">
                    Your Browser
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-white overflow-hidden relative rounded-b-lg">
                <iframe
                  src={`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.IFRAME_PROXY}?url=https://medium.com/@maddiewang/how-to-build-startups-that-get-in-yc-dabb4c1bfe1b`}
                  className="w-full h-full border-0"
                  title="Website Preview"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <button
              className="px-6 py-3 bg-brand-primary/10 text-brand-primary font-medium rounded-[8px] hover:bg-brand-primary hover:text-white transition-colors duration-150"
              onClick={() => renditionRef.current?.next()}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="w-full lg:flex-[3] flex justify-center items-center py-5 ">
            <div className="relative bg-[#222] rounded-[20px] sm:rounded-[30px] border-[6px] sm:border-[8px] border-[#333] h-[50vh] sm:h-[60vh] lg:h-[75vh] w-[280px] sm:w-[350px] lg:w-[400px] flex flex-col items-center shadow-xl">
              <div className="relative bg-white border-[8px] border-[#222] rounded-md w-[85%] h-[85%] overflow-hidden mt-10 mb-20">
                <div className="w-full overflow-y-auto">
                  <div
                    ref={viewerRef}
                    style={{
                      position: "absolute",
                      top: "0%",
                      left: "0%",
                      width: "100%",
                      height: "100%",
                      border: "3px solid #373737ff",
                      margin: "auto",
                      overflowY: "auto",
                      WebkitOverflowScrolling: "touch",
                      backgroundColor: "#fbf9f1ff",
                      zIndex: 1,
                    }}
                  ></div>
                </div>
              </div>
              <div className="absolute bottom-8 text-white/30 font-light text-2xl">
                Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
