import { useApp } from "../context/AppContext.jsx";
import { useFilteredGuides } from "../hooks/useFilteredGuides.js";

export default function Hero() {
  const { t } = useApp();
  const filtered = useFilteredGuides();

  return (
    <section className="bg-gradient-to-b from-brand-tint to-white">
      <div className="mx-auto max-w-wrap px-5 pb-11 pt-14 sm:px-8">
        <span className="text-[12px] font-bold tracking-[0.1em] text-brand-primary">
          LOCAL GUIDE CONCIERGE
        </span>

        <h1 className="m-0 mt-3.5 max-w-[620px] font-display text-[32px] font-extrabold leading-[1.15] tracking-tightest text-brand-ink sm:text-[44px]">
          {t.heroPre}
          <br />
          <span className="text-brand-primary">{t.heroHighlight}</span>
          {t.heroPost}
        </h1>

        <p className="mt-3.5 max-w-[560px] text-[15px] leading-relaxed text-brand-sub sm:text-base">
          {t.subtitle(filtered.length)}
        </p>

        <dl className="mt-8 flex flex-wrap gap-9">
          {[
            { v: `${filtered.length}명`, k: "검증 완료 가이드" },
            { v: "4.89", k: "평균 평점" },
            { v: "2시간", k: "평균 응답 시간" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col gap-0.5">
              <dt className="text-[22px] font-extrabold tracking-tight text-brand-ink">
                {s.v}
              </dt>
              <dd className="m-0 text-[13px] text-brand-faint">{s.k}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
