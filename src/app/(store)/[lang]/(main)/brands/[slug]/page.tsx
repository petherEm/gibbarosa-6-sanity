import React from "react";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getProductsByBrand } from "@/sanity/lib/products/getProductsByBrand";
import ProductsViewSimple from "@/components/products/ProductsViewSimple";

const BrandsDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) => {
  const { slug } = await params;
  const { lang } = await params;
  const products = await getProductsByBrand(slug);

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}{" "}
        </h1>
        <ProductsViewSimple products={products} lang={lang} />
      </div>
    </div>
  );
};

export default BrandsDetailPage;
