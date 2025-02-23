
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";


export const getProductsByBrand = async (brandSlug: string) => {  
  const PRODUCTS_BY_BRAND_QUERY = defineQuery(`
    *[_type == "product" && references(*[_type == "brand" && slug.current == $brandSlug]._id)] | order(name asc)`);


  try {
    const products = await sanityFetch({
      query: PRODUCTS_BY_BRAND_QUERY,
      params: {
        brandSlug,
      },
    });
    return products.data || null;
  }
  catch (error) {
    console.error("Error fetching products by category", error);
    return [];
  }

  
}


