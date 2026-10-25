import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { X } from "lucide-react";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  title: string;
}

const VideoModal = ({
  open,
  onClose,
  src,
  poster,
  title,
}: VideoModalProps) => {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  // Keep the latest onClose without restarting the video on every parent render.
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    const video = videoRef.current;

    // Autoplay can be blocked by the browser; the controls still work.
    video?.play().catch(() => undefined);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;

      video?.pause();
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <X className="h-5 w-5" />
        </button>

        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full bg-black"
        >
          {title}
        </video>
      </div>
    </div>,
    document.body
  );
};

export default VideoModal;
