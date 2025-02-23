import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type Dictionary = {
  midBanner: {
    title: string;
    subtitle: string;
    button: string;
  };
};

interface MidBannerProps {
  dict: Dictionary;
}

const MidBanner = ({ dict }: MidBannerProps) => {
  return (
    <Container className="mt-6 sm:mt-10 mx-auto px-4 overflow-hidden">
      <div className="flex flex-col gap-8 md:flex-row md:gap-x-10 md:items-center">
        <div className="order-2 md:order-1 md:w-1/2 ">
          <div className="flex flex-col md:justify-center items-start gap-y-8">
            <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
              {dict.midBanner.title}
            </h1>
            <p className="text-base sm:w-2/3 font-light md:text-lg lg:text-[16px]">
              {dict.midBanner.subtitle}
            </p>
            <Button
              asChild
              variant="ghost"
              className="mt-2 p-0 text-lg underline transition-colors hover:bg-transparent sm:text-[18px]"
            >
              <Link href="/shop" className="block !px-0 !py-3 text-left">
                {dict.midBanner.button}
              </Link>
            </Button>
          </div>
        </div>

        <div className="order-1 md:order-2 md:w-1/2">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src="https://gibbarosa.fra1.cdn.digitaloceanspaces.com/laying_lady_2.png"
              alt="hero"
              fill
              priority
              quality={100}
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MidBanner;
