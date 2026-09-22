import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GUIDES as STATIC_GUIDES } from "../data/guides.js";

const GuidesContext = createContext(null);
const STORAGE_KEY = "ybd_user_guides";

function loadUserGuides() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUserGuides(guides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
}

export function GuidesProvider({ children }) {
  const [userGuides, setUserGuides] = useState([]);

  useEffect(() => {
    setUserGuides(loadUserGuides());
  }, []);

  const addGuide = useCallback((guide) => {
    setUserGuides((prev) => {
      const next = [guide, ...prev];
      saveUserGuides(next);
      return next;
    });
  }, []);

  // 사용자가 새로 등록한 가이드가 맨 앞에 오도록 정렬
  const guides = useMemo(() => [...userGuides, ...STATIC_GUIDES], [userGuides]);

  const value = { guides, addGuide };

  return <GuidesContext.Provider value={value}>{children}</GuidesContext.Provider>;
}

export function useGuides() {
  const ctx = useContext(GuidesContext);
  if (!ctx) throw new Error("useGuides는 GuidesProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
