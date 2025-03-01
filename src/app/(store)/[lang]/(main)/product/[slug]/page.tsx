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
export const revalidate = 3600; // 1 hour

// Helper function to get language-specific content
const getContentByLang = (obj: any, lang: string, fallbackLang = "EN") => {
  if (!obj) return null;

  const langKey = lang.toUpperCase();
  return obj[langKey] || obj[fallbackLang] || null;
};

// Helper function to get price and currency based on language
const getPriceByLang = (product: any, lang: string) => {
  if (!product || !product.pricing) return { price: 0, currency: "EUR" };

  switch (lang) {
    case "pl":
      return {
        price: product.pricing.PLN || 0,
        currency: "PLN",
        estimatedRetailPrice: product.pricing.PLNestimatedRetailPrice,
      };
    default:
      return {
        price: product.pricing.EUR || 0,
        currency: "EUR",
        estimatedRetailPrice: product.pricing.EURestimatedRetailPrice,
      };
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

  // Get localized content
  const productName = getContentByLang(product.name, lang);
  const shortDescription = getContentByLang(product.shortDescription, lang);
  const longDescription = getContentByLang(product.longDescription, lang);
  const color = getContentByLang(product.color, lang);
  const material = getContentByLang(product.material, lang);
  const accessories = getContentByLang(product.accessories, lang);

  // Get pricing
  const { price, currency, estimatedRetailPrice } = getPriceByLang(
    product,
    lang
  );

  // Get condition
  const conditionTitle = product.condition?.title
    ? getContentByLang(product.condition.title, lang)
    : null;

  return (
    <Container className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-8 grid-rows-[auto_1fr]">
        {/* Left Column - Images */}
        <div className="lg:col-span-8 space-y-6 row-start-1">
          <div
            className={`relative aspect-square overflow-hidden max-w-[800px] ${isOutOfStock ? "opacity-50" : ""}`}
          >
            {product.images && product.images.length > 0 ? (
              <Image
                src={urlFor(product.images[0]).url() || "/placeholder.svg"}
                fill
                alt={productName || "Product Image"}
                className="object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image Available</span>
              </div>
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
                    alt={`${productName || "Product"} - Image ${index + 2}`}
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
                {product.brands
                  ?.map(
                    (brand) => getContentByLang(brand.title, lang) || "Brand"
                  )
                  .join(", ")}
              </p>
              <h1 className="text-3xl font-bold">{productName || "Product"}</h1>
            </div>

            <div className="text-2xl font-semibold">
              {currency} {price?.toFixed(2)}
            </div>

            <div className="text-muted-foreground">
              {shortDescription && <PortableText value={shortDescription} />}
            </div>
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

          {/* Product Details Table */}
          <Table className="[&_tr]:border-0">
            <TableBody className="[&_td]:p-2 [&_td]:border-0">
              {product.brands && product.brands.length > 0 && (
                <TableRow>
                  <TableCell className="font-medium">House</TableCell>
                  <TableCell>
                    {product.brands
                      ?.map(
                        (brand) =>
                          getContentByLang(brand.title, lang) || "Brand"
                      )
                      .join(", ")}
                  </TableCell>
                </TableRow>
              )}
              {conditionTitle && (
                <TableRow>
                  <TableCell className="font-medium">Condition</TableCell>
                  <TableCell>{conditionTitle}</TableCell>
                </TableRow>
              )}
              {color && (
                <TableRow>
                  <TableCell className="font-medium">Color</TableCell>
                  <TableCell>{color}</TableCell>
                </TableRow>
              )}
              {product.creativeDirector && (
                <TableRow>
                  <TableCell className="font-medium">
                    Creative Director
                  </TableCell>
                  <TableCell>{product.creativeDirector}</TableCell>
                </TableRow>
              )}
              {product.productionYear && (
                <TableRow>
                  <TableCell className="font-medium">Production Year</TableCell>
                  <TableCell>{product.productionYear}</TableCell>
                </TableRow>
              )}
              {material && (
                <TableRow>
                  <TableCell className="font-medium">Material</TableCell>
                  <TableCell>{material}</TableCell>
                </TableRow>
              )}
              {product.size && (
                <TableRow>
                  <TableCell className="font-medium">Size</TableCell>
                  <TableCell>{product.size}</TableCell>
                </TableRow>
              )}
              {product.dimensions && (
                <TableRow>
                  <TableCell className="font-medium">Dimensions</TableCell>
                  <TableCell>{product.dimensions}</TableCell>
                </TableRow>
              )}
              {accessories && (
                <TableRow>
                  <TableCell className="font-medium">Accessories</TableCell>
                  <TableCell>{accessories}</TableCell>
                </TableRow>
              )}
              {product.serialNumber && (
                <TableRow>
                  <TableCell className="font-medium">Serial Number</TableCell>
                  <TableCell>{product.serialNumber}</TableCell>
                </TableRow>
              )}
              {estimatedRetailPrice && (
                <TableRow>
                  <TableCell className="font-medium">
                    Estimated Retail Price
                  </TableCell>
                  <TableCell>
                    {currency} {estimatedRetailPrice.toLocaleString()}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Separator />

          {/* Product Description */}
          <div className="prose max-w-none">
            {longDescription && <PortableText value={longDescription} />}
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
