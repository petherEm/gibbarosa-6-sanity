import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByBrand = async (brandSlug: string) => {  
  const PRODUCTS_BY_BRAND_QUERY = defineQuery(`
    *[_type == "product" && references(*[_type == "brand" && slug.current == $brandSlug]._id)] {
      _id,
      name,
      pricing,
      slug,
      images,
      stock,
      isFeatured,
      "brands": brands[]-> {
        _id,
        title
      },
      "categories": categories[]-> {
        _id,
        title
      },
      "collections": collections[]-> {
        _id,
        title
      },
      "condition": condition-> {
        _id,
        title
      },
      color,
      creativeDirector,
      productionYear,
      material,
      size,
      dimensions
    } | order(name.EN asc)`);

  try {
    const products = await sanityFetch({
      query: PRODUCTS_BY_BRAND_QUERY,
      params: {
        brandSlug,
      },
    });
    return products.data || [];
  }
  catch (error) {
    console.error("Error fetching products by brand", error);
    return [];
  }
}
