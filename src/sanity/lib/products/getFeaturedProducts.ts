import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getFeaturedProducts = async () => {
    const FEATURED_PRODUCTS_QUERY = defineQuery(`*[_type == "product" && isFeatured == true] {
        _id,
        slug,
        name,
        pricing,
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
        dimensions,
        accessories,
        serialNumber
    } | order(name.EN asc)`);
    
    try {
        const products = await sanityFetch({
            query: FEATURED_PRODUCTS_QUERY,
        });
        return products.data || [];
    } catch (error) {
        console.error("Error fetching featured products", error);
        return [];
    }
};

