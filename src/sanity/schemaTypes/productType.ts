import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType} from "sanity";


export const productType = defineType({
    name: 'product',
    title: 'Products',
    type: 'document',
    icon: TrolleyIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'images',
            title: 'Product images',
            type: 'array',
            of: [{
                type: 'image',
                options: {
                    hotspot: true,
                }
            }]
        }),
        defineField({
            name: 'plnprice',
            title: 'PLNPrice',
            type: 'number',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'eurprice',
            title: 'EURPrice',
            type: 'number',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'PLdescription',
            title: 'PLDescription',
            type: 'blockContent',
           
        }),
        defineField({
            name: 'FRdescription',
            title: 'FRDescription',
            type: 'blockContent',
           
        }),
        defineField({
            name: 'ENdescription',
            title: 'ENDescription',
            type: 'blockContent',
           
        }),
        defineField({
            name: "categories",
            title: "Categories",
            type: "array",
            of: [{ type: "reference", to: { type: "category" } }],
        }),
        defineField({
            name: "brands",
            title: "Brands",
            type: "array",
            of: [{ type: "reference", to: { type: "brand" } }],
        }),
        defineField({
            name: "collections",
            title: "Collections",
            type: "array",
            of: [{ type: "reference", to: { type: "collection" } }],
        }),
        defineField({
            name: "stock",
            title: "Stock",
            type: "number",
            validation: Rule => Rule.min(0),
        }),
        defineField({
            name: "isFeatured",
            title: "Is Featured",
            type: "boolean",
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'images.0.asset',
            price: 'eurprice',
            brand: 'brands.0.name',
        },
        prepare(select) {
            return {
                title: select.title,
                subtitle: `EUR ${select.price}`,
                media: select.media,
                brand: select.brand,
            };
        },
    }
});