import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { pickLang } from "../utils/lang.js";
import Carousel from "./Carousel.jsx";
import { HeartOnImageIcon, StarIcon } from "../icons/Icons.jsx";

export default function GuideCard({ guide }) {
  const navigate = useNavigate();
  const { lang, t, favorites, toggleFavorite } = useApp();
  const fav = favorites.has(guide.id);

  const openModal = () => navigate(`/guide/${guide.id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openModal}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      }}
      className="group block cursor-pointer rounded-[18px] bg-transparent transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
    >
      <div className="relative overflow-hidden rounded-[18px]">
        <Carousel photos={guide.photos} />

        <div className="absolute left-3 top-3 z-[2] flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-brand-ink shadow-modal">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: guide.brandColor }}
          />
          {guide.handle}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(guide.id);
          }}
          className="absolute right-3 top-3 z-[2] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-brand-navy/35"
        >
          <HeartOnImageIcon filled={fav} />
        </button>

        <div className="absolute bottom-3 left-3 z-[2] rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-brand-primaryDark">
          {t.match} {guide.match}%
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2.5">
        <h3 className="m-0 font-display text-[15px] font-bold leading-snug tracking-tight text-brand-ink">
          {pickLang(guide.brand, lang)}
        </h3>
        <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[13px] font-semibold text-brand-ink">
          <StarIcon />
          <span>{guide.rating}</span>
          <span className="font-normal text-brand-faint">({guide.reviews})</span>
        </div>
      </div>

      <p className="mt-1 text-[13.5px] leading-relaxed text-brand-sub">
        {pickLang(guide.tagline, lang)}
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {guide.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-brand-primaryLight px-2.5 py-0.5 text-[12px] font-medium text-brand-primaryDark"
          >
            #{t.filters[tag]}
          </span>
        ))}
      </div>
    </div>
  );
}
