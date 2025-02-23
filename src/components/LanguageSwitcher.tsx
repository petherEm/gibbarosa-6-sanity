"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "pl", label: "PL", currency: "PLN" },
  { code: "fr", label: "FR", currency: "EUR" },
  { code: "en", label: "EN", currency: "EUR" },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLang = pathname?.split("/")[1] || "en";
  const currentLanguage = languages.find((lang) => lang.code === currentLang);

  const getNewPathname = (newLang: string) => {
    const pathParts = pathname?.split("/") || [];
    pathParts[1] = newLang;
    return pathParts.join("/");
  };

  return (
    <div className="relative group">
      <div className="flex items-center gap-1 cursor-pointer py-2 px-3 rounded-md ">
        <span className="text-sm font-medium">
          {currentLanguage?.label} | {currentLanguage?.currency}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-600 group-hover:rotate-180 transition-transform duration-200" />
      </div>

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={getNewPathname(lang.code)}
              className={`block px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                currentLang === lang.code
                  ? "bg-gray-50 text-gray-900 font-medium"
                  : "text-gray-700"
              }`}
            >
              {lang.label} | {lang.currency}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
