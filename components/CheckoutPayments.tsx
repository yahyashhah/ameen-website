"use client";

import StripeCheckout from "./StripeCheckout";
import PayPalCheckout from "./PayPalCheckout";

interface Props {
  amount: number;
  formId?: string;
}

export default function CheckoutPayments({ amount, formId = "checkout-form" }: Props) {
  const submitWithPaymentId = (paymentId: string) => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;
    let hidden = form.querySelector("input[name=paymentId]") as HTMLInputElement | null;
    if (!hidden) {
      hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "paymentId";
      form.appendChild(hidden);
    }
    hidden.value = paymentId;
    form.requestSubmit();
  };

  const onError = (err: string) => {
    // basic alert fallback; could be replaced with toast UI
    alert(err || "Payment failed");
  };

  return (
    <div className="space-y-4">
      <StripeCheckout amount={amount} onSuccess={submitWithPaymentId} onError={onError} />
      <PayPalCheckout amount={amount} onSuccess={submitWithPaymentId} onError={onError} />
    </div>
  );
}
