"use client";

import { Container } from "@/components/ui/container";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <Container className="mx-0 grid max-w-full grid-cols-1 gap-y-4 bg-background lg:grid-cols-[1fr_416px] large:gap-x-10 xl:gap-x-40">
      <CheckoutContent />
    </Container>
  );
}
