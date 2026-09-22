import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useGuides } from "../context/GuidesContext.jsx";
import { pickLang } from "../utils/lang.js";

export function useFilteredGuides() {
  const { lang, query, activeFilters, t } = useApp();
  const { guides } = useGuides();

  return useMemo(() => {
    const q = query.trim().toLowerCase();

    return guides.filter((g) => {
      const matchesFilter =
        activeFilters.includes("all") ||
        g.tags.some((tag) => activeFilters.includes(tag));

      const brand = pickLang(g.brand, lang).toLowerCase();
      const tagline = pickLang(g.tagline, lang).toLowerCase();

      const matchesQuery =
        !q ||
        brand.includes(q) ||
        tagline.includes(q) ||
        g.tags.some((tag) => t.filters[tag]?.toLowerCase().includes(q));

      return matchesFilter && matchesQuery;
    });
  }, [lang, query, activeFilters, t, guides]);
}
