import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByCategory = async (categorySlug: string) => {  
  const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
    *[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)] {
      _id,
      name,
      pricing,
      slug,
      images,
      inStock,
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
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: {
        categorySlug,
      },
    });
    return products.data || [];
  }
  catch (error) {
    console.error("Error fetching products by category", error);
    return [];
  }
}
