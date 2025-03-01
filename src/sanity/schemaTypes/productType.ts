import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  fieldsets: [
    {
      name: "nameAndPricing",
      title: "Name & Pricing",
      options: {
        collapsible: true,
        collapsed: false,
        columns: 2,
      },
    },
    {
      name: "basicInfo",
      title: "Basic Information",
      options: {
        collapsible: true,
        collapsed: false,
        columns: 2,
      },
    },
    {
      name: "additionalInfo",
      title: "Additional Information",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "productDetails",
      title: "Product Details",
      options: { collapsible: true, collapsed: false },
    },
  ],
  icon: TrolleyIcon,

  fields: [
    // Name and Pricing in columns
    defineField({
      name: "name",
      title: "Name",
      type: "object",
      fields: [
        defineField({
          name: "PL",
          title: "PL",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "FR",
          title: "FR",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "EN",
          title: "EN",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      fieldset: "nameAndPricing",
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "object",
      fields: [
        defineField({
          name: "PLN",
          title: "PLN Price",
          type: "number",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "EUR",
          title: "EUR Price",
          type: "number",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "EURestimatedRetailPrice",
          title: "EUR Estimated Retail Price",
          type: "number",
        }),
        defineField({
            name: "PLNestimatedRetailPrice",
            title: "PLN Estimated Retail Price",
            type: "number",
          }),
      ],
      fieldset: "nameAndPricing",
    }),
    
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name.EN",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: "images",
      title: "Product images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    
    // Basic Info
    defineField({
      name: "brands",
      title: "Brands",
      type: "array",
      of: [{ type: "reference", to: { type: "brand" } }],
      fieldset: "basicInfo",
    }),
    
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
      fieldset: "basicInfo",
    }),

    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      of: [{ type: "reference", to: { type: "collection" } }],
      fieldset: "basicInfo",
    }),
    
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
      fieldset: "basicInfo",
    }),
    
    defineField({
      name: "isFeatured",
      title: "Is Featured",
      type: "boolean",
      fieldset: "basicInfo",
    }),
    
    // Descriptions
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "object",
      fields: [
        defineField({
          name: "PL",
          title: "PL",
          type: "blockContent",
        }),
        defineField({
          name: "FR",
          title: "FR",
          type: "blockContent",
        }),
        defineField({
          name: "EN",
          title: "EN",
          type: "blockContent",
        }),
      ],
      fieldset: "additionalInfo",
    }),
    
    defineField({
      name: "longDescription",
      title: "Long Description",
      type: "object",
      fields: [
        defineField({
          name: "PL",
          title: "PL",
          type: "blockContent",
        }),
        defineField({
          name: "FR",
          title: "FR",
          type: "blockContent",
        }),
        defineField({
          name: "EN",
          title: "EN",
          type: "blockContent",
        }),
      ],
      fieldset: "additionalInfo",
    }),

    // Product details
    defineField({
      name: "condition",
      title: "Condition",
      type: "reference",
      to: [{ type: "condition" }],
      fieldset: "productDetails",
    }),
    
    defineField({
      name: "color",
      title: "Color",
      type: "object",
      fields: [
        defineField({
          name: "PL",
          title: "PL",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "FR",
          title: "FR",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "EN",
          title: "EN",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      fieldset: "productDetails",
    }),
    
    defineField({
      name: "creativeDirector",
      title: "Creative Director",
      type: "string",
      fieldset: "productDetails",
    }),
    
    defineField({
      name: "productionYear",
      title: "Production Year",
      type: "number",
      fieldset: "productDetails",
    }),
    
    defineField({
      name: "material",
      title: "Material",
      type: "object",
      fields: [
        defineField({
          name: "PL",
          title: "PL",
          type: "string",
        }),
        defineField({
          name: "FR",
          title: "FR",
          type: "string",
        }),
        defineField({
          name: "EN",
          title: "EN",
          type: "string",
        }),
      ],
      fieldset: "productDetails",
    }),
    
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      fieldset: "productDetails",
    }),
    
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      fieldset: "productDetails",
    }),
    
    defineField({
      name: "accessories",
      title: "Accessories",
      type: "object",
      fields: [
        defineField({
          name: "PL",
          title: "PL",
          type: "string",
        }),
        defineField({
          name: "FR",
          title: "FR",
          type: "string",
        }),
        defineField({
          name: "EN",
          title: "EN",
          type: "string",
        }),
      ],
      fieldset: "productDetails",
    }),
    
    defineField({
      name: "serialNumber",
      title: "Serial Number",
      type: "string",
      fieldset: "productDetails",
    }),
  ],
  
  preview: {
    select: {
      title: 'name.EN',
      media: 'images.0.asset',
      price: 'pricing.EUR',
      brand: 'brands.0.name',
    },
    prepare(select) {
      return {
        title: select.title,
        subtitle: select.brand ? `${select.brand} • €${select.price || 0}` : `€${select.price || 0}`,
        media: select.media,
      };
    },
  }
});