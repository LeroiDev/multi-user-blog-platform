import { useRef } from "react";
import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface BackgroundVideoProps {
  srcMp4: string;
  srcWebm?: string;
  poster: string;
  children: ReactNode;
}

export default function BackgroundVideo({
  srcMp4,
  srcWebm,
  poster,
  children,
}: BackgroundVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef);

  return (
    <div
      ref={wrapperRef}
      className="video-wrapper relative w-full h-screen overflow-hidden"
    >
      {inView && (
        <video
          key={srcMp4}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden="true"
          onCanPlay={(e) => e.currentTarget.classList.add("ready")}
        >
          {srcWebm && <source src={srcWebm} type="video/webm" />}
          <source src={srcMp4} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
