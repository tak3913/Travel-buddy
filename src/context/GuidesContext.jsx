import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GUIDES as STATIC_GUIDES } from "../data/guides.js";
import { supabase } from "../lib/supabase.js";

const GuidesContext = createContext(null);

function toGuide(row) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    handle: row.handle,
    brand: row.brand,
    tagline: row.tagline,
    bio: row.bio,
    tags: row.tags,
    photos: row.photos,
    brandColor: row.brand_color,
    stats: row.stats,
    rating: Number(row.rating),
    reviews: row.reviews,
    match: row.match,
    createdAt: row.created_at,
  };
}

export function GuidesProvider({ children }) {
  const [userGuides, setUserGuides] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase));

  const refreshGuides = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) console.warn("가이드 목록을 불러오지 못했습니다.", error.message);
    else setUserGuides((data || []).map(toGuide));
    setLoading(false);
  }, []);

  useEffect(() => { refreshGuides(); }, [refreshGuides]);

  const addGuide = useCallback(async (guide) => {
    if (!supabase) {
      throw new Error("Supabase가 아직 설정되지 않았어요.");
    }
    const { data, error } = await supabase
      .from("guides")
      .insert({
        owner_id: guide.ownerId,
        handle: guide.handle,
        brand: guide.brand,
        tagline: guide.tagline,
        bio: guide.bio,
        tags: guide.tags,
        photos: guide.photos.map(String),
        brand_color: guide.brandColor,
        stats: guide.stats,
      })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("이미 사용 중인 핸들이에요. 다른 핸들을 입력해주세요.");
      throw error;
    }
    const savedGuide = toGuide(data);
    setUserGuides((previous) => [savedGuide, ...previous]);
    return savedGuide;
  }, []);

  // 사용자가 새로 등록한 가이드가 맨 앞에 오도록 정렬
  const guides = useMemo(() => [...userGuides, ...STATIC_GUIDES], [userGuides]);

  const value = { guides, loading, addGuide, refreshGuides };

  return <GuidesContext.Provider value={value}>{children}</GuidesContext.Provider>;
}

export function useGuides() {
  const ctx = useContext(GuidesContext);
  if (!ctx) throw new Error("useGuides는 GuidesProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
