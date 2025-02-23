import Link from "next/link";

interface NavLinksProps {
  dict: {
    navbar: {
      new: string;
      shop: string;
      collections: string;
      about: string;
      brands: string;
    };
  };
  lang: string;
}

export default function NavLinks({ dict, lang }: NavLinksProps) {
  const prefix = lang === "en" ? "" : `/${lang}`;

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <Link
        href={`${prefix}/new-in`}
        className="transition-colors hover:text-primary"
      >
        {dict.navbar.new}
      </Link>
      <Link
        href={`${prefix}/shop`}
        className="transition-colors hover:text-primary"
      >
        {dict.navbar.shop}
      </Link>
      <Link
        href={`${prefix}/collections`}
        className="transition-colors hover:text-primary"
      >
        {dict.navbar.collections}
      </Link>
      <Link
        href={`${prefix}/about`}
        className="transition-colors hover:text-primary"
      >
        {dict.navbar.about}
      </Link>
      <Link
        href={`${prefix}/brands`}
        className="transition-colors hover:text-primary"
      >
        {dict.navbar.brands}
      </Link>
    </nav>
  );
}
