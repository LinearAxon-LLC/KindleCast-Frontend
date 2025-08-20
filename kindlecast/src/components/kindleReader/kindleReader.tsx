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

export default function KindleReader({
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

  const [bookTitle, setBookTitle] = useState<string>("Loading…");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        // Destroy previous rendition and book if any
        if (renditionRef.current) {
          renditionRef.current.destroy();
          renditionRef.current = null;
        }
        bookRef.current = null;

        const res = await fetch(preview_path);

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const book = ePub(arrayBuffer);

        bookRef.current = book;

        const rendition = book.renderTo(viewerRef.current as HTMLElement, {
          width: "100%",
          height: "100%",
          spread: "none",
          flow: "paginated",
        });

        // Register a hook to add the font-face rule to the iframe's stylesheet
        rendition.hooks.content.register((contents: Contents) => {
          const fontFaceRules = {
            "@font-face": [
              {
                "font-family": "LibreBaskerville",
                src: "url('/fonts/LibreBaskerville-Regular.ttf')",
                "font-weight": "normal", // This is the regular weight
                "font-style": "normal",
              },
              {
                "font-family": "LibreBaskerville",
                src: "url('/fonts/LibreBaskerville-Bold.ttf')",
                "font-weight": "bold", // This is the bold weight
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
            "margin-left": "1px",
            "margin-right": "1px",
          },
          p: {
            "font-size": "14px", // adjust to your desired size
          },
          span: {
            "font-size": "14px", // adjust to your desired size
          },
          div: {
            "font-size": "14px", // adjust to your desired size
          },
          h1: {
            "font-size": "20px",
          },
          h2: {
            "font-size": "16px",
          },
          li: {
            "font-size": "14px",
          },
          a: {
            color: "#4a4a4aff !important", // Add !important to ensure it's applied
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
          // Now that the content is rendered, ensure the theme is selected
          rendition.themes.select("kindle");
        });

        const metadata = await book.loaded.metadata;
        setBookTitle(metadata.title || "Untitled");
      } catch (err) {
        console.error("Failed to load book:", err);
      }
    };

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!renditionRef.current) return;
      if (e.key === "ArrowRight") renditionRef.current.next();
      if (e.key === "ArrowLeft") renditionRef.current.prev();
    });

    renditionRef.current?.on("touchstart", (event: TouchEvent) => {
      const startX = event.changedTouches[0].screenX;

      const handleTouchEnd = (ev: TouchEvent) => {
        const endX = ev.changedTouches[0].screenX;
        if (startX - endX > 50) renditionRef.current?.next(); // swipe left
        if (endX - startX > 50) renditionRef.current?.prev(); // swipe right
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchend", handleTouchEnd);
    });

    fetchBook();
  }, [preview_path]);

  return (
    <div className="relative flex items-center w-full h-[80vh] gap-3">
      <button
        className="px-6 py-3 bg-brand-primary/10 text-brand-primary font-medium rounded-[8px] hover:bg-brand-primary hover:text-white transition-colors duration-150"
        onClick={() => renditionRef.current?.prev()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="lucide lucide-chevron-left-icon lucide-chevron-left"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div>
        <div
          className="relative w-[400px] h-[724px] mt-[-30px] mb-8 flex justify-center items-center"
          style={{
            backgroundImage: "url('/kindle_mockup.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          ref={viewerRef}
          style={{
            position: "absolute",
            top: "8%",
            left: "23%",
            width: "56%",
            height: "70%",
            border: "3px solid #373737ff",
            margin: "auto",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            backgroundColor: "#fbf9f1ff",
          }}
        >
          {!url || !isSuccess ? (
            // If URL is missing, display the placeholder text
            <div className="flex items-center justify-center h-full text-center p-4">
              <p className="text-gray-500 text-sm">
                Paste a link and press "Preview" to get started.
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <button
        className="px-6 py-3 bg-brand-primary/10 text-brand-primary font-medium rounded-[8px] hover:bg-brand-primary hover:text-white transition-colors duration-150"
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
      <div className="flex justify-center gap-4 w-full"></div>
    </div>
  );
}
