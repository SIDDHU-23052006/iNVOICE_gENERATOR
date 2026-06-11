import { InvoiceData } from "@/lib/storage";
import { formatCurrency } from "@/lib/currency";

export function InvoicePreview({ data, currency = "INR" }: { data: InvoiceData, currency?: string }) {
  return (
    <div id="yasi-invoice-pdf" className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative">
      {/* Header Band */}
      <div className="h-32 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-10 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          {data.from.logo ? (
            <img src={data.from.logo} alt="Logo" className="max-h-16 max-w-[200px] object-contain bg-white/10 rounded p-1" />
          ) : (
            <div className="text-2xl font-bold tracking-tight">{data.from.name || "COMPANY NAME"}</div>
          )}
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-serif font-bold tracking-widest opacity-90">INVOICE</h1>
          <div className="text-indigo-100 mt-1">{data.number}</div>
        </div>
      </div>

      <div className="p-10 pt-8 space-y-8">
        
        {/* Meta */}
        <div className="flex justify-between border-b border-gray-200 pb-6 text-sm">
          <div className="space-y-1">
            <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Date</div>
            <div className="font-medium">{new Date(data.date).toLocaleDateString()}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Due Date</div>
            <div className="font-medium">{new Date(data.dueDate).toLocaleDateString()}</div>
          </div>
          {data.poNumber && (
            <div className="space-y-1">
              <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">PO Number</div>
              <div className="font-medium">{data.poNumber}</div>
            </div>
          )}
          {data.placeOfSupply && (
            <div className="space-y-1">
              <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Place of Supply</div>
              <div className="font-medium">{data.placeOfSupply}</div>
            </div>
          )}
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-1 text-sm leading-relaxed">
            <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider mb-3">From</div>
            <div className="font-bold text-lg text-gray-900">{data.from.name}</div>
            {data.from.address && <div className="whitespace-pre-line text-gray-700">{data.from.address}</div>}
            {(data.from.city || data.from.state || data.from.country || data.from.postalCode) && (
              <div className="text-gray-700">
                {[data.from.city, data.from.state, data.from.postalCode, data.from.country].filter(Boolean).join(", ")}
              </div>
            )}
            {data.from.email && <div className="text-gray-600">Email: {data.from.email}</div>}
            {data.from.phone && <div className="text-gray-600">Phone: {data.from.phone}</div>}
            {data.from.website && <div className="text-gray-600">Web: {data.from.website}</div>}
            {data.from.gstin && <div className="mt-2 text-gray-600">GSTIN: {data.from.gstin}</div>}
            {(data.from.pan || data.from.taxId) && <div className="text-gray-600">PAN/Tax ID: {data.from.pan || data.from.taxId}</div>}
          </div>

          <div className="space-y-2 text-sm leading-relaxed">
            <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider mb-3">Bill To</div>
            <div className="font-bold text-lg text-gray-900">{data.billTo.name}</div>
            {data.billTo.address && <div className="whitespace-pre-line">{data.billTo.address}</div>}
            <div>{[data.billTo.state, data.billTo.country].filter(Boolean).join(", ")}</div>
            {data.billTo.gstin && <div className="mt-2 text-gray-600">GSTIN: {data.billTo.gstin}</div>}
            {data.billTo.email && <div className="text-gray-600">{data.billTo.email}</div>}
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8 rounded overflow-hidden border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">HSN/SAC</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.items.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.description}</td>
                  <td className="px-4 py-3 text-gray-600">{item.hsn}</td>
                  <td className="px-4 py-3 text-right">{item.qty} {item.unit}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.unitPrice, currency)}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(item.qty * item.unitPrice, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-4">
          <div className="w-72 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(data.totals.subtotal, currency)}</span>
            </div>
            {data.totals.discount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span>-{formatCurrency(data.totals.discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium border-b border-gray-200 pb-3">
              <span>Taxable Amount</span>
              <span>{formatCurrency(data.totals.taxableAmount, currency)}</span>
            </div>
            
            {data.taxMode === "india_gst" ? (
              data.gstType === "intra_state" ? (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST</span>
                    <span>{formatCurrency(data.totals.cgst, currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 pb-2">
                    <span>SGST</span>
                    <span>{formatCurrency(data.totals.sgst, currency)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-gray-600 pb-2">
                  <span>IGST</span>
                  <span>{formatCurrency(data.totals.igst, currency)}</span>
                </div>
              )
            ) : (
              <div className="flex justify-between text-gray-600 pb-2">
                <span>VAT</span>
                <span>{formatCurrency(data.totals.vat, currency)}</span>
              </div>
            )}

            {data.shipping > 0 && (
              <div className="flex justify-between text-gray-600 pb-2">
                <span>Shipping</span>
                <span>{formatCurrency(data.shipping, currency)}</span>
              </div>
            )}

            {data.totals.roundOff !== 0 && (
              <div className="flex justify-between text-gray-600 pb-2 text-xs">
                <span>Round Off</span>
                <span>{formatCurrency(data.totals.roundOff, currency)}</span>
              </div>
            )}

            <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-gray-800 text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(data.totals.grandTotal, currency)}</span>
            </div>
          </div>
        </div>

        {/* Footer info: Bank + Signature */}
        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-gray-200 pt-8 pb-4">
          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            {data.paymentDetails && (data.paymentDetails.bankName || data.paymentDetails.upi) && (
              <div>
                <div className="font-semibold uppercase text-xs tracking-wider text-gray-900 mb-2">Payment Details</div>
                {data.paymentDetails.bankName && <div>Bank: {data.paymentDetails.bankName}</div>}
                {data.paymentDetails.account && <div>Account: {data.paymentDetails.account}</div>}
                {data.paymentDetails.ifsc && <div>IFSC/SWIFT: {data.paymentDetails.ifsc}</div>}
                {data.paymentDetails.upi && <div>UPI: {data.paymentDetails.upi}</div>}
              </div>
            )}
            
            {data.notes && (
              <div>
                <div className="font-semibold uppercase text-xs tracking-wider text-gray-900 mb-2">Notes</div>
                <div className="whitespace-pre-line">{data.notes}</div>
              </div>
            )}
            
            {data.terms && (
              <div>
                <div className="font-semibold uppercase text-xs tracking-wider text-gray-900 mb-2">Terms & Conditions</div>
                <div className="whitespace-pre-line text-xs">{data.terms}</div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end justify-end h-full">
            <div className="relative w-48 h-32 flex items-center justify-center border-b border-gray-300 pb-2 mb-2">
              {data.from.stamp && (
                <img 
                  src={data.from.stamp} 
                  alt="Stamp" 
                  className="absolute opacity-60 mix-blend-multiply w-24 h-24 object-contain -rotate-12 right-4 bottom-4" 
                />
              )}
              {data.from.signature && (
                <img 
                  src={data.from.signature} 
                  alt="Signature" 
                  className="relative z-10 max-w-full max-h-24 object-contain" 
                />
              )}
              {!data.from.signature && !data.from.stamp && (
                <span className="text-gray-300 italic text-xs">Authorized Signatory</span>
              )}
            </div>
            <div className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
              For {data.from.name}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
