"use client";

import { useEffect, useRef, useState } from "react";
import ePub, { Rendition, Book, Contents } from "epubjs";
import { Libre_Baskerville } from "next/font/google";

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

  const [urlInput, setUrlInput] = useState("");
  const demoLinks = [
    "https://en.wikipedia.org/wiki/Next.js",
    "https://www.reddit.com/r/javascript/",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://developer.mozilla.org/en-US/",
  ];

  const [bookTitle, setBookTitle] = useState<string>("Loading…");
  const [selectedFormat, setSelectedFormat] = useState("Quick Send");
  const [previewurl, setPreviewUrl] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const loadBook = async () => {
      try {
        // Destroy previous rendition and book if any
        if (renditionRef.current) {
          renditionRef.current.destroy();
          renditionRef.current = null;
        }
        bookRef.current = null;

        // Map each format to a local epub file inside /public/epubs
        const formatToEpub: Record<string, string> = {
          "Quick Send": "/epubs/quick.epub",
          Summarize: "/epubs/summarize.epub",
          "Study Guide": "/epubs/study_guide.epub",
          Custom: "/epubs/custom.epub",
        };

        const epubPath = formatToEpub[selectedFormat] || "/epubs/default.epub";
        const book = ePub(epubPath);
        bookRef.current = book;

        const rendition = book.renderTo(viewerRef.current as HTMLElement, {
          width: "100%",
          height: "100%",
          spread: "none",
          flow: "paginated",
        });

        // Register fonts
        rendition.hooks.content.register((contents: Contents) => {
          const fontFaceRules = {
            "@font-face": [
              {
                "font-family": "LibreBaskerville",
                src: "url('/fonts/LibreBaskerville-Regular.ttf')",
                "font-weight": "normal",
                "font-style": "normal",
              },
              {
                "font-family": "LibreBaskerville",
                src: "url('/fonts/LibreBaskerville-Bold.ttf')",
                "font-weight": "bold",
                "font-style": "normal",
              },
            ],
          };
          contents.addStylesheetRules(fontFaceRules, "libre-baskerville-font");
        });

        await rendition.display();
        renditionRef.current = rendition;

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
            textDecoration: "underline !important",
            "font-size": "14px",
          },
          img: {
            filter: "grayscale(100%)",
            maxWidth: "50%",
            height: "auto",
            display: "block",
            margin: "0 auto !important",
          },
        });

        rendition.on("rendered", () => {
          rendition.themes.select("kindle");
        });

        const metadata = await book.loaded.metadata;
        setBookTitle(metadata.title || "Untitled");

        // 👇 Auto-advance pages every 800ms
        interval = setInterval(() => {
          const rendition = renditionRef.current;
          const book = bookRef.current;

          if (!rendition || !book) return;

          const location = rendition.location;

          // Check if we're at the last page
          if (location?.atEnd) {
            // Go back to the first page
            rendition.prev();
          } else {
            // Go to the next page
            rendition.next();
          }
        }, 1000);
      } catch (err) {
        console.error("Failed to load book:", err);
      }
    };

    loadBook();

    // ✅ proper cleanup when selectedFormat changes or component unmounts
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedFormat]);

  useEffect(() => {
    let linkIndex = 0; // which link we're on
    let charIndex = 0; // which character in the link
    let deleting = false;

    const interval = setInterval(() => {
      const currentLink = demoLinks[linkIndex];

      if (!deleting) {
        // typing forward
        setUrlInput(currentLink.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentLink.length) {
          // pause before deleting
          deleting = true;
          setTimeout(() => {}, 1000);
        }
      } else {
        // deleting backwards
        setUrlInput(currentLink.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          linkIndex = (linkIndex + 1) % demoLinks.length; // move to next link
        }
      }
    }, 120); // typing speed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-between my-1">
      <div className="w-full flex items-center justify-center max-w-4xl mx-auto mb-6 sm:mb-8 mt-8 sm:mt-12 px-4">
        <div className="w-4/5 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_25px_rgba(0,0,0,0.04)] p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <input
                  type="text"
                  value={urlInput}
                  className={`border-brand-primary/80 border-2 ring-2 ring-brand-primary/20 w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/[0.03] rounded-[8px] text-[14px] sm:text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:outline-none transition-all duration-200 cursor-text`}
                  disabled // prevent user editing
                />
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-[12px] sm:text-[13px] font-medium text-black/60 uppercase tracking-[0.4px] mb-2 sm:mb-3 block text-center">
                  Choose your format:
                </label>

                <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                  {["Quick Send", "Summarize", "Study Guide", "Custom"].map(
                    (format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => setSelectedFormat(format)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[6px] text-[12px] sm:text-[13px] font-medium transition-all duration-150 active:scale-[0.95] cursor-pointer ${
                          selectedFormat === format
                            ? "bg-brand-primary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
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

              {/* Custom Description - Only show when Custom is selected */}
              {selectedFormat === "Custom" && (
                <div>
                  <label className="text-[12px] sm:text-[13px] font-medium text-black/60 uppercase tracking-[0.4px] mb-2 sm:mb-3 block text-center">
                    Describe how you want it:
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., 'make me a business playbook from this link'"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/[0.03] border rounded-[8px] text-[14px] sm:text-[15px] text-black/85 placeholder:text-black/40 focus:bg-white focus:outline-none transition-all duration-200 resize-none cursor-text ${
                      error &&
                      selectedFormat === "Custom" &&
                      !customPrompt.trim()
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-black/[0.08] focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20"
                    }`}
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer Enhancement */}
        {/* <div className="text-[12px] sm:text-[13px] text-black/40 text-center mt-6 sm:mt-8 font-normal">
          Free for 5 Quick Sends & 3 AI Formatting per month. No credit card
          required
        </div> */}
      </div>

      <div className="w-[90vw] flex items-center justify-center">
        {/* Chrome Previewer */}
        <div className="flex-[7] flex justify-center items-center py-5">
          {/* Chrome-style previewer container */}
          <div className="w-full relative bg-[#f1f1f1] rounded-lg border border-gray-400 h-[75vh] shadow-2xl flex flex-col">
            {/* Top bar (browser chrome) */}
            <div className="w-full flex items-center justify-between bg-[#e5e5e5] border-b border-gray-300 px-4 h-10 rounded-t-lg">
              {/* Traffic lights (close, minimize, maximize) */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              {/* Fake tab */}
              <div className="flex-1 flex justify-start items-start ml-2">
                <div className="bg-white border border-gray-300 pl-5 pr-10 py-1 rounded-t-md shadow-sm text-sm text-gray-600">
                  Your Browser
                </div>
              </div>
              {/* <div className="w-16"></div> Spacer for balance */}
            </div>

            {/* Screen area */}
            <div className="flex-1 bg-white overflow-hidden relative rounded-b-lg">
              <iframe
                src="http://localhost:8000/api/v1/link/proxy?url=https://medium.com/@maddiewang/how-to-build-startups-that-get-in-yc-dabb4c1bfe1b" // Replace with any URL
                className="w-full h-full border-0"
                title="Webpage Preview"
              />
            </div>
          </div>
        </div>
        {/* Arrow Button */}

        {/* Kindle Previewer */}
        <div className="flex-[3] flex justify-center items-center py-5">
          <button
            className="px-10 py-3 mx-8 bg-brand-primary/10 text-brand-primary font-medium rounded-[8px] hover:bg-brand-primary hover:text-white transition-colors duration-150"
            onClick={() => renditionRef.current?.next()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="lucide lucide-chevron-right-icon lucide-chevron-right"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <div className="relative bg-[#222] rounded-[30px] border-[8px] border-[#333] h-[75vh] min-w-[400px] max-w-[100px] flex flex-col items-center shadow-xl">
            {/* Screen */}
            <div className="relative bg-white border-[8px] border-[#222] rounded-md w-[85%] h-[85%] overflow-hidden mt-10 mb-20">
              {/* The viewerRef div is given a lower z-index */}

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
                    zIndex: 1, // Set a lower z-index
                  }}
                ></div>
              </div>
            </div>
            {/* Kindle Logo */}
            <div className="absolute bottom-8 text-white/30 font-light text-2xl">
              Preview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
