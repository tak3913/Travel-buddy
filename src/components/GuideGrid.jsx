import { useApp } from "../context/AppContext.jsx";
import { useFilteredGuides } from "../hooks/useFilteredGuides.js";
import { MapPinIcon } from "../icons/Icons.jsx";
import GuideCard from "./GuideCard.jsx";

export default function GuideGrid() {
  const { t } = useApp();
  const filtered = useFilteredGuides();

  return (
    <main className="mx-auto grid max-w-wrap grid-cols-1 gap-6 px-5 pb-16 sm:grid-cols-2 sm:gap-5 sm:px-8 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.length === 0 ? (
        <div className="col-span-full py-24 text-center text-brand-sub">
          <MapPinIcon className="mx-auto text-brand-sub" />
          <p className="mt-1 text-sm">{t.emptyTitle}</p>
          <p className="mt-1 text-sm">{t.emptySub}</p>
        </div>
      ) : (
        filtered.map((g) => <GuideCard key={g.id} guide={g} />)
      )}
    </main>
  );
}
