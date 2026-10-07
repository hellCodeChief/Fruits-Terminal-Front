import Footer from "@/components/footer/footer";
import LandingCarousel from "./components/carousel";
import DailyProducts from "./components/daily-products";
import ProductFeatures from "./components/product-features";
import PromotionBox from "./components/promotion-box";
import SpecialShopBox from "./components/special-shop-box/index";
import {
  getAllCategoriesISR,
  getAllProductISR,
} from "@/components/utils/actionsSSR";

export default async function Home() {
  const allCategories = (await getAllCategoriesISR()) || [];

  // const allProducts = (await getAllProductISR()) || [];
  const allProducts = await getAllProductISR({
    page: 1,
    page_size: 5,
  });

  return (
    <div>
      <LandingCarousel />
      <div className="container px-4 mx-auto">
        {/* ✅ کارت‌های روزانه بلافاصله بعد از اسلایدر؛ خود اسلایدر همان است */}
        <DailyProducts />
        <SpecialShopBox allCategories={allCategories} />
        <PromotionBox />
        <ProductFeatures allProducts={allProducts} />
      </div>
      <Footer />
    </div>
  );
}
