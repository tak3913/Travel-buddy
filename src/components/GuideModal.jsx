import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { useGuides } from "../context/GuidesContext.jsx";
import { pickLang } from "../utils/lang.js";
import Carousel from "./Carousel.jsx";
import { CloseIcon, HeartInkIcon, StarIcon } from "../icons/Icons.jsx";

export default function GuideModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t, favorites, toggleFavorite } = useApp();
  const { guides } = useGuides();

  const guide = guides.find((g) => String(g.id) === String(id));

  const close = () => navigate("/");

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!guide) return null;

  const fav = favorites.has(guide.id);
  const brandName = pickLang(guide.brand, lang);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative max-h-[88vh] w-full max-w-[720px] overflow-y-auto rounded-3xl bg-white">
        <button
          onClick={close}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-modal"
        >
          <CloseIcon />
        </button>

        <Carousel photos={guide.photos} modalSize />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-primaryLight px-2.5 py-1 text-[11px] font-semibold text-brand-primary">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: guide.brandColor }}
                />
                {guide.handle}
              </div>
              <h2 className="m-0 font-display text-2xl font-semibold text-brand-ink">
                {brandName}
              </h2>
              <p className="mt-1 text-sm text-brand-sub">
                {pickLang(guide.tagline, lang)}
              </p>
            </div>
            <button
              onClick={() => toggleFavorite(guide.id)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primaryLight"
            >
              <HeartInkIcon filled={fav} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-brand-ink">
            <StarIcon />
            <span>
              {guide.rating} · {t.reviewsLine(guide.reviews)}
            </span>
            <span className="ml-1 rounded-full bg-brand-primaryLight px-2.5 py-0.5 text-xs text-brand-primary">
              {t.matchLong} {guide.match}%
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-primaryLight px-2.5 py-0.5 text-xs text-brand-primary"
              >
                #{t.filters[tag]}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm leading-[1.7] text-brand-sub">
            {pickLang(guide.bio, lang)}
          </p>

          <h4 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-brand-sub">
            {t.style}
          </h4>

          <div className="space-y-2.5">
            {Object.entries(guide.stats || {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 text-sm">
                <span className="w-16 shrink-0 text-brand-sub">{t.stats[key]}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-border">
                  <div
                    className="h-full rounded-full bg-brand-primary"
                    style={{ width: `${(value / 5) * 100}%` }}
                  />
                </div>
                <span className="w-7 text-right text-xs text-brand-sub">{value}/5</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate(`/guides/${guide.id}/inquiry`)}
            className="mt-7 w-full rounded-xl bg-brand-primary py-3.5 text-sm font-semibold text-white hover:bg-brand-primaryDark"
          >
            {t.cta(brandName.split(" ")[0])}
          </button>
        </div>
      </div>
    </div>
  );
}
