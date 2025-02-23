import { getAllCollections } from "@/sanity/lib/products/getAllCollections";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import { Collection } from "../../../../../../sanity.types";
import { urlFor } from "@/sanity/lib/image";

const CollectionsPage = async () => {
  const collections = await getAllCollections();

  return (
    <Container className="py-16">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Our Collections</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our curated collections of luxury items
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection: Collection) => (
            <Link
              key={collection._id}
              href={`/collections/${collection.slug?.current}`}
              className="group relative aspect-square overflow-hidden"
            >
              {/* Placeholder image - replace with actual collection image */}
              <Image
                src={urlFor(collection.image!).url() || "/placeholder.png"}
                alt={collection.EN_title || "Collection Image"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />

              {/* Collection title */}
              <div className="absolute inset-0 flex items-end p-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">
                    {collection.EN_title}
                  </h2>
                  <p className="text-sm text-white/90">
                    {collection.description}
                  </p>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default CollectionsPage;
