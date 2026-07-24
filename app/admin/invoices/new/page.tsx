import { Suspense } from "react";
import InvoiceForm from "@/components/admin/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <div className="container-lg py-10">
      <div className="eyebrow mb-2">Billing</div>
      <h1 className="font-display text-3xl text-ivory mb-10">New Invoice</h1>
      <Suspense fallback={<p className="text-slate text-sm">Loading…</p>}>
        <InvoiceForm />
      </Suspense>
    </div>
  );
}
