import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import GuideGrid from "../components/GuideGrid.jsx";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <GuideGrid />

      {/* "/guide/:id" 경로일 때 이 자리에 GuideModal이 오버레이로 렌더링됩니다 */}
      <Outlet />
    </>
  );
}
