"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import useCartStore from "@/store/store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ShippingAddressFormProps {
  onShippingComplete: (data: any, clientSecret: string) => void;
}

export default function ShippingAddressForm({
  onShippingComplete,
}: ShippingAddressFormProps) {
  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    apartment: z.string().optional(),
    city: z.string().min(2, "City must be at least 2 characters"),
    country: z.string().min(2, "Please select a country"),
    state: z.string().min(2, "Please select a state/province"),
    postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    shippingMethod: z
      .string()
      .optional()
      .refine((val) => {
        // Now form will be in scope
        const country = form.getValues("country");
        if (country === "PL") {
          return val === "DHL" || val === "INPOST";
        }
        return true;
      }, "Please select a shipping method"),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingData, setShippingData] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const cartItems = useCartStore((state) => state.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.eurprice! * item.quantity,
    0
  );
  const shippingCost = 15;
  const total = subtotal + shippingCost;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      country: "",
      state: "",
      postalCode: "",
      phone: "",
    },
  });

  const createPaymentIntent = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total + (data.shippingMethod === "INPOST" ? 10 : 15), // Adjust total based on shipping method
          shipping: {
            ...data,
            shippingMethod: data.shippingMethod || "DHL", // Default to DHL for non-Polish addresses
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create payment intent");
      }

      setShippingData(data);
      onShippingComplete(data, result.clientSecret);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCountry = form.watch("country");

  return (
    <div className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

        <p className="mt-2 text-muted-foreground">
          Please fill in your shipping information.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createPaymentIntent)}
            className="mt-8 space-y-6"
          >
            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Shipping Address</h2>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AT">Austria</SelectItem>
                          <SelectItem value="BE">Belgium</SelectItem>
                          <SelectItem value="BG">Bulgaria</SelectItem>
                          <SelectItem value="HR">Croatia</SelectItem>
                          <SelectItem value="CY">Cyprus</SelectItem>
                          <SelectItem value="CZ">Czech Republic</SelectItem>
                          <SelectItem value="DK">Denmark</SelectItem>
                          <SelectItem value="EE">Estonia</SelectItem>
                          <SelectItem value="FI">Finland</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="GR">Greece</SelectItem>
                          <SelectItem value="HU">Hungary</SelectItem>
                          <SelectItem value="IE">Ireland</SelectItem>
                          <SelectItem value="IT">Italy</SelectItem>
                          <SelectItem value="LV">Latvia</SelectItem>
                          <SelectItem value="LT">Lithuania</SelectItem>
                          <SelectItem value="LU">Luxembourg</SelectItem>
                          <SelectItem value="MT">Malta</SelectItem>
                          <SelectItem value="NL">Netherlands</SelectItem>
                          <SelectItem value="PL">Poland</SelectItem>
                          <SelectItem value="PT">Portugal</SelectItem>
                          <SelectItem value="RO">Romania</SelectItem>
                          <SelectItem value="SK">Slovakia</SelectItem>
                          <SelectItem value="SI">Slovenia</SelectItem>
                          <SelectItem value="ES">Spain</SelectItem>
                          <SelectItem value="SE">Sweden</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedCountry === "PL" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shippingMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Shipping Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="DHL" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                DHL Courier (€15.00)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="INPOST" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                InPost Parcel Locker (€10.00)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Continue to payment"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
