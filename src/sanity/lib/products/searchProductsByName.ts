import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductsByName = async (searchParams: string) => {
    // Search across all language fields in the name object
    const PRODUCT_SEARCH_QUERY = defineQuery(`*[_type == "product" && (
        name.EN match $searchParams || 
        name.FR match $searchParams || 
        name.PL match $searchParams
    )] {
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
            query: PRODUCT_SEARCH_QUERY,
            params: { searchParams: `*${searchParams}*` },
        });

        return products.data || [];
    } catch (error) {
        console.error("Error searching products by name", error);
        return [];
    }
}
