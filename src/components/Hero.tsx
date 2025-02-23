import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

interface HeroProps {
  dict: {
    hero: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
  lang?: string;
}

export function Hero({ dict, lang }: HeroProps) {
  return (
    <section className="relative -mt-16 min-h-[calc(100vh-4rem)] overflow-hidden">
      <Container className="relative">
        <div className="grid min-h-[calc(100vh-4rem)] items-center pb-20 pt-32 lg:grid-cols-2 lg:gap-12 lg:pb-20 lg:pt-20">
          <div className="relative z-10 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:max-w-[540px]">
              {dict.hero.title}
            </h1>
            <p className="text-muted-foreground lg:max-w-[480px]">
              {dict.hero.subtitle}
            </p>
            <Button
              asChild
              variant="ghost"
              className="mt-2 p-0 text-lg underline transition-colors hover:bg-transparent sm:text-[18px]"
            >
              <Link href="/about" className="block !px-0 !py-3 text-left">
                {dict.hero.button}
              </Link>
            </Button>
          </div>
        </div>
      </Container>
      <div className="absolute right-0 top-0 z-0 h-full w-full animate-in fade-in slide-in-from-right-4 duration-1000 fill-mode-forwards lg:w-1/2">
        <div className="relative h-full w-full">
          {/* Desktop Image */}
          <Image
            src="https://gibbarosa.fra1.cdn.digitaloceanspaces.com/hero_1.png"
            alt="Hero Image"
            fill
            priority
            className="hidden object-contain object-right lg:block"
            sizes="(min-width: 1024px) 50vw, 100vw"
            quality={90}
          />
          {/* Mobile/Tablet Image */}
          <div className="relative h-full lg:hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
            <Image
              src="https://gibbarosa.fra1.cdn.digitaloceanspaces.com/hero_1.png"
              alt="Hero Image"
              fill
              priority
              className="object-cover object-[80%_center] opacity-25 sm:object-center md:opacity-40"
              sizes="100vw"
              quality={90}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
