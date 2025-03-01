import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductBySlug = async (slug: string) => {
    const PRODUCT_BY_ID_QUERY = defineQuery(`
        *[_type == "product" && slug.current == $slug][0]{
            _id,
            name,
            pricing,
            slug,
            images,
            stock,
            isFeatured,
            shortDescription,
            longDescription,
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
            serialNumber,
            _createdAt,
            _updatedAt
        }
    `);
    
    try {
        const product = await sanityFetch({
            query: PRODUCT_BY_ID_QUERY,
            params: {
                slug,
            },
        });
        return product.data || null;
    } catch (error) {
        console.error("Error fetching product by slug", error);
        return null;
    }
};

