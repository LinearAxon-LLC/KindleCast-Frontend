"use client";

import { useEffect, useRef, useState } from "react";
import ePub, { Rendition, Book, Contents } from "epubjs";

export default function KindleReader() {
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

        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/link/preview?ts=${Date.now()}`
        );
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

        rendition.hooks.content.register((contents: Contents) => {
          // Define the CSS for your font face
          const fontFaceRule = {
            "@font-face": {
              "font-family": "Merriweather",
              src: "url('/fonts/Merriweather-VariableFont_opsz,wdth,wght.ttf')",
            },
          };

          // Add the CSS rules with a unique key as the second argument
          // e.g., 'merriweather-font-face'
          contents.addStylesheetRules(fontFaceRule, "merriweather-font-face");
        });

        await rendition.display();
        renditionRef.current = rendition;
        rendition.themes.default({
          "*": {
            "font-family": "Georgia, serif",
          },
          p: {
            "font-family": "Georgia, serif",
            "font-size": "14px", // adjust to your desired size
          },
          span: {
            "font-family": "Georgia, serif",
            "font-size": "14px", // adjust to your desired size
          },
          div: {
            "font-family": "Georgia, serif",
            "font-size": "14px", // adjust to your desired size
          },
          h1: {
            "font-family": "Georgia, serif",
            "font-size": "20px",
          },
          h2: {
            "font-family": "Georgia, serif",
            "font-size": "16px",
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

    fetchBook();
  }, []);

  return (
    <div className="relative flex flex-col items-center w-full h-[80vh]">
      <div className="flex justify-center gap-4 mt-2">
        <button onClick={() => renditionRef.current?.prev()}>Previous</button>
        <button onClick={() => renditionRef.current?.next()}>Next</button>
      </div>
      <div
        className="relative w-[536px] h-[724px] mt-4 mb-4 flex justify-center items-center"
        style={{
          backgroundImage: "url('/kindle_mockup.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div
          ref={viewerRef}
          style={{
            position: "absolute",
            top: "10%",
            left: "20%",
            width: "60%",
            height: "76%",
            border: "1px solid #fbf9f1ff",
            margin: "auto",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            backgroundColor: "#fbf9f1ff",
          }}
        ></div>
      </div>
    </div>
  );
}
