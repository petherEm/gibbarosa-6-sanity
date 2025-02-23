import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllBrands = async () => {
  const ALL_BRANDS_QUERY = defineQuery(`*[_type == "brand"] | order(name asc)`);
  
  try {
    const brands = await sanityFetch({
      query: ALL_BRANDS_QUERY,
    });
    return brands.data || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};