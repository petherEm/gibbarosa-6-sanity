import { BasketIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const orderType = defineType({
    name: 'order',
    title: 'Orders',
    type: 'document',
    icon: BasketIcon,
    fields: [
        defineField({
            name: "orderNumber",
            title: "Order number",
            type: "string",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "stripeCheckoutSessionId",
            title: "Stripe Checkout Session ID",
            type: "string",
        }),
        defineField({
            name: "stripePaymentIntentId",
            title: "Stripe Payment Intent ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "stripeCustomerId",
            title: "Stripe Customer ID",
            type: "string",
        }),
        defineField({
            name: "customerName",
            title: "Customer Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "email",
            title: "Customer Email",
            type: "string",
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: "shippingAddress",
            title: "Shipping Address",
            type: "object",
            fields: [
                defineField({
                    name: "address",
                    title: "Address",
                    type: "string",
                }),
                defineField({
                    name: "apartment",
                    title: "Apartment/Suite",
                    type: "string",
                }),
                defineField({
                    name: "city",
                    title: "City",
                    type: "string",
                }),
                defineField({
                    name: "state",
                    title: "State/Province",
                    type: "string",
                }),
                defineField({
                    name: "postalCode",
                    title: "Postal Code",
                    type: "string",
                }),
                defineField({
                    name: "country",
                    title: "Country",
                    type: "string",
                }),
                defineField({
                    name: "phone",
                    title: "Phone",
                    type: "string",
                }),
            ],
        }),
        defineField({
            name: "products",
            title: "Products",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({
                            name: "product",
                            title: "Product",
                            type: "reference",
                            to: [{ type: "product" }],
                        }),
                        defineField({
                            name: "quantity",
                            title: "Quantity",
                            type: "number",
                        }),
                    ],
                    preview: {
                        select: {
                            title: "product.name.EN",
                            quantity: "quantity",
                            image: "product.images.0",
                            pricing: "product.pricing",
                        },
                        prepare(select) {
                            const { title, quantity, image, pricing } = select;
                            const price = pricing?.EUR || pricing?.PLN || 0;
                            return {
                                title: title || "Unnamed Product",
                                subtitle: `Quantity: ${quantity || 0} - Price: ${price}`,
                                media: image,
                            };
                        },
                    }
                }),
            ],
        }),
        defineField({
            name: "totalPrice",
            title: "Total Price",
            type: "number",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "currency",
            title: "Currency",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "amountDiscount",
            title: "Amount Discount",
            type: "number",
        }),
        defineField({
            name: "shippingMethod",
            title: "Shipping Method",
            type: "string",
            options: {
                list: [
                    { title: "Standard", value: "standard" },
                    { title: "Express", value: "express" },
                ],
            }
        }),
        defineField({
            name: "status",
            title: "Order Status",
            type: "string",
            options: {
                list: [
                    { title: "Pending", value: "pending" },
                    { title: "Paid", value: "paid" },
                    { title: "Shipped", value: "shipped" },
                    { title: "Delivered", value: "delivered" },
                    { title: "Cancelled", value: "cancelled" },
                ],
            },
            initialValue: "pending",
        }),
        defineField({
            name: "orderDate",
            title: "Order Date",
            type: "datetime",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "notes",
            title: "Order Notes",
            type: "text",
        }),
    ],
    preview: {
        select: {
           name: "customerName",
           amount: "totalPrice",
           currency: "currency",
           orderId: "orderNumber",
           email: "email",
           status: "status",
        },
        prepare(select) {
            return {
                title: `${select.orderId} - ${select.name}`,
                subtitle: `${select.amount} ${select.currency} | ${select.status?.toUpperCase() || 'PENDING'} | ${select.email}`,
            };
        },
    },
})