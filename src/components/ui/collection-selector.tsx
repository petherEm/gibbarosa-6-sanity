"use client";
import { useState } from "react";
import { Category, Collection } from "../../../sanity.types";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { cn } from "@/lib/utils";

interface CollectionSelectorProps {
  collections: Collection[];
}

export function CollectionSelectorComponent({
  collections = [], // Add default empty array
}: CollectionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");

  const router = useRouter();

  if (!collections) return null; // Add null check

  console.log("Collections from CollectionSelectorComponent", collections);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-full relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 
          bg-transparent hover:bg-black/5 text-black border-2 border-black/80 hover:border-black 
          font-medium py-3 px-6 rounded-md transition-all duration-200 h-12"
        >
          {value
            ? collections.find(
                (collection: Category) => collection._id === value
              )?.EN_title
            : "Filter by category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-2 border-black/10 rounded-md shadow-lg">
        <Command>
          <CommandInput
            placeholder="Search categories"
            className="h-11 border-none focus:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const selectedCollection = collections.find((c) =>
                  c.EN_title?.toLowerCase().includes(
                    e.currentTarget.value.toLowerCase()
                  )
                );
                if (selectedCollection?.slug?.current) {
                  setValue(selectedCollection._id);
                  router.push(
                    `/collections/${selectedCollection.slug.current}`
                  );
                  setOpen(false);
                }
              }
            }}
          />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {Array.isArray(collections) &&
                collections.map(
                  (
                    collection // Add Array.isArray check
                  ) => (
                    <CommandItem
                      key={collection._id}
                      value={collection.EN_title}
                      className="py-3 px-4 cursor-pointer hover:bg-black/5 transition-colors duration-200"
                      onSelect={() => {
                        setValue(
                          value === collection._id ? "" : collection._id
                        );
                        router.push(`/categories/${collection.slug?.current}`);
                        setOpen(false);
                      }}
                    >
                      {collection.EN_title}{" "}
                      {/* Change from collection.title to collection.EN_title */}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === collection._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  )
                )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
