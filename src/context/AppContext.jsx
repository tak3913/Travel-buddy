import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { I18N } from "../data/i18n.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState("ko");
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(["all"]);
  const [favorites, setFavorites] = useState(() => new Set());

  const toggleFilter = useCallback((key) => {
    setActiveFilters((prev) => {
      if (key === "all") return ["all"];
      const withoutAll = prev.filter((k) => k !== "all");
      if (withoutAll.includes(key)) {
        const next = withoutAll.filter((k) => k !== key);
        return next.length ? next : ["all"];
      }
      return [...withoutAll, key];
    });
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // 번역 객체 (원본의 t() 함수 역할)
  const t = useMemo(() => I18N[lang], [lang]);

  const value = {
    lang,
    setLang,
    query,
    setQuery,
    activeFilters,
    toggleFilter,
    favorites,
    toggleFavorite,
    t,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp은 AppProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
