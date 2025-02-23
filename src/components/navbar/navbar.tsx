"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
    <motion.header
      layout
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-sm dark:bg-gray-950/80"
          : "bg-transparent"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center">
          <motion.div layout className="flex items-center">
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onOpenChange={setIsMobileMenuOpen}
              dict={dict}
              lang={lang}
            />

            {/* Logo with responsive sizing */}
            <motion.div layout className="transition-transform duration-200">
              <div className="block md:hidden">
                <Logo size="small" />
              </div>
              <div className="hidden md:block">
                <Logo size="large" />
              </div>
            </motion.div>

            {/* Navigation links with adjusted spacing */}
            <div className="hidden md:flex ml-2 lg:ml-4">
              <NavLinks dict={dict} lang={lang} />
            </div>
          </motion.div>

          <motion.div
            layout
            className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2"
          >
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
                  className="h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
            </AnimatePresence>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
              <ThemeToggle />
              <CartDropdown />
            </div>
          </motion.div>
        </div>
      </Container>
    </motion.header>
  );
}
