
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";


export const getProductsByCollection = async (collectionSlug: string) => {  
  const PRODUCTS_BY_COLLECTION_QUERY = defineQuery(`
    *[_type == "product" && references(*[_type == "collection" && slug.current == $collectionSlug]._id)] | order(name asc)`);


  try {
    const products = await sanityFetch({
      query: PRODUCTS_BY_COLLECTION_QUERY,
      params: {
        collectionSlug,
      },
    });
    return products.data || null;
  }
  catch (error) {
    console.error("Error fetching products by category", error);
    return [];
  }

  
}


