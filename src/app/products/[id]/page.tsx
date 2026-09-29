import { findProductISR } from "@/components/utils/actionsSSR";
import SingleProductClient from "./components";
import { imgSrcCreator } from "@/components/utils/helper/imgSrcCreator";

export default async function SingleProduct({ params }: any) {
  console.log("params", params);
  const productData = await findProductISR(params.id);

  //rewrite
  const singleProductData = () => {
    return {
      ...productData,
      files: Array.isArray(productData.files)
        ? productData.files.map((y: any) => ({
            ...y,
            fileUrl: imgSrcCreator(y.id, "product"),
          }))
        : [],
      variants: Array.isArray(productData.variants)
        ? productData.variants.map((x: any) => ({
            ...x,
            files: Array.isArray(x.files)
              ? x.files.map((y: any) => ({
                  ...y,
                  fileUrl: imgSrcCreator(y.id, "product-variant"),
                }))
              : [],
          }))
        : [],
    };
  };

  const rewriteData = await singleProductData();

  return <SingleProductClient item={rewriteData} />;
}
