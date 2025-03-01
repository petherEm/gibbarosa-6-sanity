import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllCollections = async () => {
    const ALL_COLLECTIONS_QUERY = defineQuery(`*[_type == "collection"] {
        _id,
        title,
        slug,
        description,
        image
    } | order(title.EN asc)`);
    
    try {
        const collections = await sanityFetch({
            query: ALL_COLLECTIONS_QUERY,
        });
        return collections.data || [];
    } catch (error) {
        console.error("Error fetching all collections", error);
        return [];
    }
}

