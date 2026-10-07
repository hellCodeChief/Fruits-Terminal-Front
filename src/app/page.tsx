import Footer from "@/components/footer/footer";
import LandingCarousel from "./components/carousel";
import DailyProducts from "./components/daily-products";
import PromotionBox from "./components/promotion-box";
import SpecialShopBox from "./components/special-shop-box/index";
import { getAllCategoriesISR } from "@/components/utils/actionsSSR";

export default async function Home() {
  const allCategories = (await getAllCategoriesISR()) || [];

  return (
    <div>
      <LandingCarousel />
      <div className="container px-4 mx-auto">
        {/* ✅ کارت‌های روزانه بلافاصله بعد از اسلایدر؛ خود اسلایدر همان است */}
        <DailyProducts />
        <SpecialShopBox allCategories={allCategories} />
        <PromotionBox />
        {/* ✅ جدیدترین‌ها محصولات قبلی است؛ از لندینگ برداشته شد. ProductFeatures حذف نشده */}
      </div>
      <Footer />
    </div>
  );
}
