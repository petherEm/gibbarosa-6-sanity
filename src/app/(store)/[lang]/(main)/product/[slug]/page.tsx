import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { notFound } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "../../../../../../../sanity.types";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ShieldCheckIcon, Box, RefreshCcw } from "lucide-react";
import BuyNowButton from "@/components/BuyNowButton";

export const dynamic = "force-static";
export const revalidate = 60 * 60; // 1 hour

const getDescriptionByLang = (product: any, lang: string) => {
  switch (lang) {
    case "pl":
      return product.PLdescription;
    case "fr":
      return product.FRdescription;
    case "en":
      return product.ENdescription;
    default:
      return product.ENdescription;
  }
};

const getPriceByLang = (product: Product, lang: string) => {
  switch (lang) {
    case "pl":
      return { price: product.plnprice, currency: "PLN" };
    default:
      return { price: product.eurprice, currency: "EUR" };
  }
};

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) => {
  const { slug, lang } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;
  const description = getDescriptionByLang(product, lang);
  const { price, currency } = getPriceByLang(product, lang);

  return (
    <Container className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-8 grid-rows-[auto_1fr]">
        {/* Left Column - Images */}
        <div className="lg:col-span-8 space-y-6 row-start-1">
          <div
            className={`relative aspect-square overflow-hidden max-w-[800px] ${isOutOfStock ? "opacity-50" : ""}`}
          >
            {product.images && (
              <Image
                src={urlFor(product.images[0]).url() || "/placeholder.svg"}
                fill
                alt={product.name ?? "Product Image"}
                className="object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white font-bold text-lg">
                  Out of stock
                </span>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-2 gap-1 max-w-[800px]">
              {product.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/5] overflow-hidden snap-start"
                >
                  <Image
                    src={urlFor(image).url() || "/placeholder.svg"}
                    fill
                    alt={`${product.name} - Image ${index + 2}`}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 lg:self-start space-y-8 row-start-2 lg:row-start-1">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Brand name
              </p>
              <h1 className="text-3xl font-bold">{product.name}</h1>
            </div>

            <div className="text-2xl font-semibold">
              {currency} {price?.toFixed(2)}
            </div>

            <p className="text-muted-foreground">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Exercitationem explicabo omnis, doloremque nam dolor optio iste
              sapiente rerum aut voluptatem.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <AddToCartButton product={product} disabled={isOutOfStock} />
            <BuyNowButton product={product} disabled={isOutOfStock} />
          </div>

          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheckIcon className="h-4 w-4" />
              Authenticity guarantee
            </li>
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Box className="h-4 w-4" />
              Shipping in 1-2 days
            </li>
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCcw className="h-4 w-4" />
              Return or exchange
            </li>
          </ul>

          <Separator />

          <Table className="[&_tr]:border-0">
            <TableBody className="[&_td]:p-2 [&_td]:border-0">
              <TableRow>
                <TableCell className="font-medium">House</TableCell>
                <TableCell>Dior</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Condition</TableCell>
                <TableCell>Very Good</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Color</TableCell>
                <TableCell>Navy Blue</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Creative Director</TableCell>
                <TableCell>John Galliano</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Production Year</TableCell>
                <TableCell>2013</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Material</TableCell>
                <TableCell>Cotton</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Size</TableCell>
                <TableCell>XS</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dimensions</TableCell>
                <TableCell>20 x 24 x 13 cm</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Accessories</TableCell>
                <TableCell>Dust bag, authenticity certificate, box</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Serial Number</TableCell>
                <TableCell>2142430238232411</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Estimated Retail Price
                </TableCell>
                <TableCell>15,000,000 PLN</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Separator />

          {/* Product Description */}
          <div className="prose max-w-none">
            {Array.isArray(description) && <PortableText value={description} />}
          </div>

          {/* Accordion Sections */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="guarantee">
              <AccordionTrigger>Guarantee</AccordionTrigger>
              <AccordionContent>
                All our items are guaranteed authentic and undergo a thorough
                authentication process before being listed for sale.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping</AccordionTrigger>
              <AccordionContent>
                We offer worldwide shipping. Delivery times vary by location.
                Express shipping options are available at checkout.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="returns">
              <AccordionTrigger>Returns</AccordionTrigger>
              <AccordionContent>
                Returns are accepted within 14 days of delivery. Item must be
                unused and in original packaging with all tags attached.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        {/* Add your product recommendations here */}
      </div>
    </Container>
  );
};

export default ProductPage;
