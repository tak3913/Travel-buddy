import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경 변수가 없는 개발 환경에서도 화면이 깨지지 않도록 지연 초기화합니다.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase가 아직 설정되지 않았어요. .env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요."
    );
  }
  return supabase;
}
