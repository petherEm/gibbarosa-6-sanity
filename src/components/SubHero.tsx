import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type Dictionary = {
  ourStoryShort: {
    title: string;
    text_1: string;
    text_2: string;
    button: string;
  };
};

interface SubHeroProps {
  dict: Dictionary;
}

const SubHero = ({ dict }: SubHeroProps) => {
  return (
    <Container className="mt-6 sm:mt-10 mx-auto px-4 overflow-hidden">
      <div className="flex flex-col gap-8 md:flex-row md:gap-x-10 md:items-start">
        {/* Left Image Container */}
        <div className="md:w-1/2">
          <div className="relative aspect-[4/5] w-full max-w-[600px]">
            <Image
              src="https://gibbarosa.fra1.cdn.digitaloceanspaces.com/Sub-hero_1.png"
              alt="hero"
              fill
              priority
              quality={100}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
            />
          </div>
        </div>

        {/* Text Container */}
        <div className="md:w-1/2">
          <div className="flex flex-col gap-6 md:gap-8 md:h-full md:max-h-[calc(125vh*4/5)] md:justify-between">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                {dict.ourStoryShort.title}
              </h1>
              <p className="text-base sm:w-2/3 font-light md:text-lg lg:text-[16px]">
                {dict.ourStoryShort.text_1}
              </p>
            </div>

            <div className="flex justify-start">
              <div className="relative aspect-[3/4] w-1/2 max-w-[280px]">
                <Image
                  src="https://gibbarosa.fra1.cdn.digitaloceanspaces.com/aboutus.png"
                  alt="About us image 1"
                  fill
                  priority
                  quality={100}
                  className="object-cover"
                  sizes="(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 289px"
                />
              </div>
              <div className="relative aspect-[3/4] w-1/2 max-w-[280px]">
                <Image
                  src="https://gibbarosa.fra1.cdn.digitaloceanspaces.com/aboutus_3.png"
                  alt="About us image 2"
                  fill
                  priority
                  quality={100}
                  className="object-cover"
                  sizes="(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 289px"
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-base sm:w-2/3 font-light md:text-lg lg:text-[16px]">
                {dict.ourStoryShort.text_2}
              </p>
              <Button
                asChild
                variant="ghost"
                className="mt-2 p-0 text-lg underline transition-colors hover:bg-transparent sm:text-[18px]"
              >
                <Link href="/about" className="block !px-0 !py-3 text-left">
                  {dict.ourStoryShort.button}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SubHero;
