import { Container } from "@/components/ui/container";
import ShippingAddressForm from "./ShippingAddressForm";
import OrderSummary from "@/components/OrderSummary";

const CheckoutPage = () => {
  return (
    <Container className="mx-0 grid max-w-full grid-cols-1 gap-y-4 bg-background lg:grid-cols-[1fr_416px] large:gap-x-10 xl:gap-x-40">
      {/* Shipping Address Section */}
      <ShippingAddressForm />

      {/* Order Summary Section */}
      <div className="bg-muted px-4 py-8 lg:px-8">
        <OrderSummary />
      </div>
    </Container>
  );
};

export default CheckoutPage;
