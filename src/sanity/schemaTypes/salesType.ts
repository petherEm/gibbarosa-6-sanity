import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";


export const salesType = defineType({
    name: 'sale',
    title: 'Sale',
    type: 'document',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            title: 'Sale Title',
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            title: 'Sale Description'
        }),
        defineField({
            name: 'discountAmount',
            type: 'number',
            title: 'Discount Amount',
            description: 'Amount off in percentage or fixed value',
        }),
        defineField({
            name: 'couponCode',
            type: 'string',
            title: 'Coupon Code',
            
        }),
        defineField({
            name: 'validFrom',
            type: 'datetime',
            title: 'Valid From',
            
        }),
        defineField({
            name: 'validUntil',
            type: 'datetime',
            title: 'Valid Until',
            
        }),
        defineField({
            name: 'isActive',
            type: 'boolean',
            title: 'Is Active',
            description: 'Check to activate the sale',
            initialValue: true,
        })
    ],
});