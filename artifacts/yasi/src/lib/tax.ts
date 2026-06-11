import { InvoiceData, InvoiceItem } from "./storage";

export function computeLineTotals(item: InvoiceItem) {
  const lineSubtotal = item.qty * item.unitPrice;
  const lineDiscount = lineSubtotal * (item.discountPercent / 100);
  const lineTaxable = lineSubtotal - lineDiscount;
  const lineTax = lineTaxable * (item.taxRate / 100);
  
  return {
    lineSubtotal,
    lineDiscount,
    lineTaxable,
    lineTax,
    lineTotal: lineTaxable + lineTax
  };
}

export function computeInvoiceTotals(
  items: InvoiceItem[],
  taxMode: InvoiceData["taxMode"],
  gstType: InvoiceData["gstType"],
  globalDiscount: number,
  shipping: number
): InvoiceData["totals"] {
  let subtotal = 0;
  let totalItemDiscount = 0;
  let taxableAmount = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let vat = 0;

  items.forEach(item => {
    const { lineSubtotal, lineDiscount, lineTaxable, lineTax } = computeLineTotals(item);
    subtotal += lineSubtotal;
    totalItemDiscount += lineDiscount;
    taxableAmount += lineTaxable;

    if (taxMode === "india_gst") {
      if (gstType === "intra_state") {
        cgst += lineTax / 2;
        sgst += lineTax / 2;
      } else {
        igst += lineTax;
      }
    } else {
      vat += lineTax;
    }
  });

  // Apply global discount proportionally across taxable amount (simplified here)
  const actualTaxable = taxableAmount - globalDiscount;
  
  // Re-calculate tax if there's a global discount?
  // Usually global discount applies before tax, but for simplicity, 
  // if it's a fixed amount, we just subtract from grand total, or subtract from taxable and adjust taxes.
  // We'll subtract from taxable, but keep the item-level tax sums. 
  // A true SAP system would distribute it, but we'll just adjust the final tax by ratio.
  
  const discountRatio = taxableAmount > 0 ? Math.max(0, actualTaxable / taxableAmount) : 1;
  
  cgst *= discountRatio;
  sgst *= discountRatio;
  igst *= discountRatio;
  vat *= discountRatio;

  const totalTax = cgst + sgst + igst + vat;
  const rawGrandTotal = actualTaxable + totalTax + shipping;
  const roundedGrandTotal = Math.round(rawGrandTotal);
  const roundOff = roundedGrandTotal - rawGrandTotal;

  return {
    subtotal,
    discount: totalItemDiscount + globalDiscount,
    taxableAmount: actualTaxable,
    cgst,
    sgst,
    igst,
    vat,
    roundOff,
    grandTotal: roundedGrandTotal
  };
}
