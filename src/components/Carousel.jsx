import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons/Icons.jsx";

export default function Carousel({ photos, modalSize = false }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  };

  const handleArrowClick = (e, dir) => {
    e.stopPropagation();
    const track = trackRef.current;
    if (!track) return;
    const current = Math.round(track.scrollLeft / track.clientWidth);
    const max = photos.length - 1;
    goTo(Math.max(0, Math.min(max, current + dir)));
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(idx);
  };

  return (
    <div
      className={`group relative w-full overflow-hidden ${
        modalSize ? "h-72 rounded-none" : "h-56 rounded-2xl"
      }`}
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar"
      >
        {photos.map((seed, i) => (
          <img
            key={i}
            src={String(seed).startsWith("http") ? seed : `https://picsum.photos/id/${seed}/600/700`}
            alt=""
            draggable={false}
            className="h-full w-full shrink-0 snap-start object-cover"
          />
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => handleArrowClick(e, -1)}
            className="absolute left-2 top-1/2 z-[3] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-90 shadow-modal transition-opacity hover:opacity-100"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={(e) => handleArrowClick(e, 1)}
            className="absolute right-2 top-1/2 z-[3] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-90 shadow-modal transition-opacity hover:opacity-100"
          >
            <ChevronRightIcon />
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === activeIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
