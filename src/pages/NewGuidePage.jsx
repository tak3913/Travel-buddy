import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useGuides } from "../context/GuidesContext.jsx";
import { FILTER_KEYS } from "../data/i18n.js";

const TAG_OPTIONS = FILTER_KEYS.filter((k) => k !== "all");

const COLOR_OPTIONS = [
  "#2563EB",
  "#0EA5E9",
  "#0891B2",
  "#4F46E5",
  "#7C3AED",
  "#0D9488",
];

const STAT_KEYS = ["food", "photo", "shopping", "history", "chat"];

export default function NewGuidePage() {
  const { t } = useApp();
  const { currentUser } = useAuth();
  const { addGuide } = useGuides();
  const navigate = useNavigate();

  const [handle, setHandle] = useState("");
  const [brand, setBrand] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState([]);
  const [photoUrls, setPhotoUrls] = useState(["", "", ""]);
  const [brandColor, setBrandColor] = useState(COLOR_OPTIONS[0]);
  const [stats, setStats] = useState({
    food: 3,
    photo: 3,
    shopping: 3,
    history: 3,
    chat: 3,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleTag(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
    );
  }

  function handlePhotoChange(index, value) {
    setPhotoUrls((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleStatChange(key, value) {
    setStats((prev) => ({ ...prev, [key]: Number(value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!handle.trim() || !brand.trim() || !tagline.trim() || !bio.trim()) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (tags.length === 0) {
      setError("태그를 1개 이상 선택해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const cleanedPhotos = photoUrls.map((u) => u.trim()).filter(Boolean);
      const normalizedHandle = handle.trim().startsWith("@")
        ? handle.trim()
        : `@${handle.trim()}`;
      const savedGuide = await addGuide({
        brandColor,
        handle: normalizedHandle,
        tags,
        photos: cleanedPhotos,
        brand: { ko: brand.trim(), en: brand.trim(), zh: brand.trim(), ja: brand.trim() },
        tagline: { ko: tagline.trim(), en: tagline.trim(), zh: tagline.trim(), ja: tagline.trim() },
        bio: { ko: bio.trim(), en: bio.trim(), zh: bio.trim(), ja: bio.trim() },
        stats,
        ownerId: currentUser.id,
      });
      navigate(`/guide/${savedGuide.id}`);
    } catch (submitError) {
      setError(submitError.message || "가이드 카드 저장에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-primary";

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-1 mt-6 font-display text-2xl font-semibold text-brand-ink">
        가이드 카드 등록하기
      </h1>
      <p className="mb-8 text-sm text-brand-sub">
        여행객에게 나를 소개할 가이드 카드를 만들어보세요. 언제든 다시 수정할 수 있어요.
      </p>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* 기본 정보 */}
        <section className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-ink">
              핸들(닉네임) *
            </label>
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="예: minsu_seoul"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-ink">
              가이드/브랜드 이름 *
            </label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="예: 민수의 서울 여행 연구소"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-ink">
              한 줄 소개 *
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="예: 관광객이 모르는 서울을 소개합니다"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-ink">
              소개글 *
            </label>
            <textarea
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="어떤 여행을 함께할 수 있는지 소개해주세요."
              className={inputClass}
            />
          </div>
        </section>

        {/* 태그 */}
        <section>
          <p className="mb-2 text-sm font-medium text-brand-ink">
            태그 (1개 이상 선택) *
          </p>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => {
              const active = tags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-brand-border bg-white text-brand-ink hover:border-brand-ink"
                  }`}
                >
                  {t.filters[tag]}
                </button>
              );
            })}
          </div>
        </section>

        {/* 사진 */}
        <section>
          <p className="mb-1 text-sm font-medium text-brand-ink">사진 URL (선택, 최대 3장)</p>
          <p className="mb-2 text-xs text-brand-sub">
            비워두면 기본 샘플 사진이 사용됩니다.
          </p>
          <div className="space-y-2">
            {photoUrls.map((url, i) => (
              <input
                key={i}
                type="url"
                value={url}
                onChange={(e) => handlePhotoChange(i, e.target.value)}
                placeholder={`https://example.com/photo-${i + 1}.jpg`}
                className={inputClass}
              />
            ))}
          </div>
        </section>

        {/* 브랜드 색상 */}
        <section>
          <p className="mb-2 text-sm font-medium text-brand-ink">브랜드 색상</p>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setBrandColor(color)}
                style={{ background: color }}
                className={`h-8 w-8 rounded-full ring-offset-2 ${
                  brandColor === color ? "ring-2 ring-brand-ink" : ""
                }`}
                aria-label={color}
              />
            ))}
          </div>
        </section>

        {/* 여행 스타일 */}
        <section>
          <p className="mb-3 text-sm font-medium text-brand-ink">여행 스타일</p>
          <div className="space-y-3">
            {STAT_KEYS.map((key) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-sm text-brand-sub">
                  {t.stats[key]}
                </span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={stats[key]}
                  onChange={(e) => handleStatChange(key, e.target.value)}
                  className="flex-1 accent-brand-primary"
                />
                <span className="w-7 text-right text-xs text-brand-sub">
                  {stats[key]}/5
                </span>
              </div>
            ))}
          </div>
        </section>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-primary py-3.5 text-sm font-semibold text-white hover:bg-brand-primaryDark disabled:opacity-60"
        >
          가이드 카드 만들기
        </button>
      </form>
    </div>
  );
}
