/**
 * 다국어 필드({ ko, en, zh, ja })에서 현재 언어 값을 가져옵니다.
 * 사용자가 직접 등록한 가이드는 한국어만 입력받으므로, 없는 언어는
 * ko 값으로 자연스럽게 대체됩니다.
 */
export function pickLang(field, lang) {
  if (!field) return "";
  return field[lang] ?? field.ko ?? Object.values(field)[0] ?? "";
}
