"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import Form from "next/form";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="ghost" size="icon" disabled={pending}>
      <Search className={`h-5 w-5 ${pending ? "animate-spin" : ""}`} />
      <span className="sr-only">Search</span>
    </Button>
  );
}

interface SearchFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchForm({ isOpen, onClose }: SearchFormProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "100%", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center max-w-[400px] w-full"
    >
      <Form action="/search" className="flex w-full items-center">
        <Input
          ref={searchInputRef}
          name="query"
          placeholder="Search products..."
          className="mr-2"
        />
        <SearchButton />
        <Button type="button" variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close search</span>
        </Button>
      </Form>
    </motion.div>
  );
}
