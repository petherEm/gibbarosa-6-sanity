import { Container } from "@/components/ui/container";
import React from "react";

export default function NotFound() {
  return (
    <Container className="py-16 h-screen flex items-center justify-center">
      <div className="space-y-8 ">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Zuuut!</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            This page does not exist or boss took it down.
          </p>
        </div>
      </div>
    </Container>
  );
}
