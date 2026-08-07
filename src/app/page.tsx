import Introduction from "@/components/Introduction";
import Previously from "@/components/Previously";
import SelectedWork from "@/components/SelectedWork";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <main>
        <Introduction />
        <SelectedWork />
        <Previously />
      </main>
      <SiteFooter />
    </div>
  );
}
