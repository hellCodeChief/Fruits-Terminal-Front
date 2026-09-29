"use client";
import Box from "./box";

export default function SpecialShopBox({ allCategories }: any) {
  const parentCategories = allCategories.filter((x: any) => x.isParent == true);

  const categoriesSafe = Array.isArray(parentCategories)
    ? parentCategories
    : [];
  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl">دسته بندی ها:</h2>
      <div className="flex flex-wrap justify-between pt-7">
        {categoriesSafe.map((item: any, index: any) => (
          <Box key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
