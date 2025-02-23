import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { Container } from "./ui/container";

type FooterProps = {
  dict: {
    footer: {
      tagline: string;
      disclaimer: string;
      shop: {
        title: string;
        bags: string;
        shoes: string;
        jewelry: string;
        accessories: string;
      };
      orders: {
        title: string;
        shipping: string;
        returns: string;
        complaints: string;
        authenticity: string;
        condition: string;
      };
      information: {
        title: string;
        aboutUs: string;
        photoSessions: string;
        affiliate: string;
      };
      contact: {
        title: string;
        writeUs: string;
        email: string;
      };
      legal: {
        rights: string;
        privacy: string;
        terms: string;
        cookies: string;
      };
    };
  };
  lang: string;
};

export default function Footer({ dict, lang }: FooterProps) {
  const { footer } = dict;
  const prefix = lang === "en" ? "" : `/${lang}`;

  return (
    <footer className="w-full bg-[#FF6943] text-black">
      <Container className="py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="space-y-8 md:col-span-3 mb-8 md:mb-0">
            <span className="text-4xl font-normal tracking-wide font-staatliches">
              Gibbarosa
            </span>
            <div className="space-y-8 flex flex-col">
              <p>{footer.tagline}</p>
              <p className="text-sm font-normal">{footer.disclaimer}</p>
            </div>
          </div>

          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:pl-8 lg:pl-16">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{footer.shop.title}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`${prefix}/shop/bags`}
                    className="hover:underline"
                  >
                    {footer.shop.bags}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${prefix}/shop/shoes`}
                    className="hover:underline"
                  >
                    {footer.shop.shoes}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    {footer.shop.jewelry}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    {footer.shop.accessories}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">{footer.orders.title}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`${prefix}/shipping`} className="hover:underline">
                    {footer.orders.shipping}
                  </Link>
                </li>
                <li>
                  <Link href={`${prefix}/returns`} className="hover:underline">
                    {footer.orders.returns}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    {footer.orders.complaints}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    {footer.orders.authenticity}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    {footer.orders.condition}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">{footer.information.title}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`${prefix}/about`} className="hover:underline">
                    {footer.information.aboutUs}
                  </Link>
                </li>
                <li>
                  <Link href={`${prefix}/about`} className="hover:underline">
                    {footer.information.photoSessions}
                  </Link>
                </li>
                <li>
                  <Link href={`${prefix}/about`} className="hover:underline">
                    {footer.information.affiliate}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">{footer.contact.title}</h3>
              <ul className="space-y-2">
                <li>{footer.contact.writeUs}</li>
                <li>
                  <Link href="#" className="hover:underline">
                    {footer.contact.email}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-12 mt-8 md:mt-12">
            <div className="flex space-x-4">
              <Link href="#" className="hover:opacity-80">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:opacity-80">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Gibbarosa. {footer.legal.rights}
            </p>
            <div className="flex space-x-6">
              <Link
                href={`${prefix}/privacy`}
                className="text-sm hover:underline"
              >
                {footer.legal.privacy}
              </Link>
              <Link
                href={`${prefix}/terms`}
                className="text-sm hover:underline"
              >
                {footer.legal.terms}
              </Link>
              <Link
                href={`${prefix}/cookies`}
                className="text-sm hover:underline"
              >
                {footer.legal.cookies}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
