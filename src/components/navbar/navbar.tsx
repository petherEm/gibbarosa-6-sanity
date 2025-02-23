"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Logo from "./logo";
import NavLinks from "./nav-links";
import SearchForm from "./search-form";
import CartDropdown from "./cart-dropdown";
import ThemeToggle from "./theme-toggle";
import MobileMenu from "./mobile-menu";
import LanguageSwitcher from "../LanguageSwitcher";

export default function Navbar({ dict, lang }: { dict: any; lang: string }) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-sm dark:bg-gray-950/80"
          : "bg-transparent"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Logo />
            <NavLinks dict={dict} lang={lang} />
          </div>

          <MobileMenu
            isOpen={isMobileMenuOpen}
            onOpenChange={setIsMobileMenuOpen}
            dict={dict}
            lang={lang}
          />

          <div className="flex flex-1 items-center justify-end space-x-2">
            <AnimatePresence>
              {isSearchOpen ? (
                <SearchForm
                  isOpen={isSearchOpen}
                  onClose={() => setIsSearchOpen(false)}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
            </AnimatePresence>

            <LanguageSwitcher />
            <ThemeToggle />
            <CartDropdown />
          </div>
        </div>
      </Container>
    </header>
  );
}
