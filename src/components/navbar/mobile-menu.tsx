"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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

export default function MobileMenu({
  isOpen,
  onOpenChange,
  dict,
  lang,
}: MobileMenuProps) {
  const prefix = lang === "en" ? "" : `/${lang}`;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4">
          <Link href={`${prefix}/`} className="text-lg font-bold">
            Gibbarosa
          </Link>
          <Link href={`${prefix}/new-in`} className="text-sm">
            {dict.navbar.new}
          </Link>
          <Link href={`${prefix}/shop`} className="text-sm">
            {dict.navbar.shop}
          </Link>
          <Link href={`${prefix}/collections`} className="text-sm">
            {dict.navbar.collections}
          </Link>
          <Link href={`${prefix}/about`} className="text-sm">
            {dict.navbar.about}
          </Link>
          <Link href={`${prefix}/brands`} className="text-sm">
            {dict.navbar.brands}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
