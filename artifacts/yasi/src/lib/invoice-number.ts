export function generateAutoInvoiceNumber(prefix: string = "INV"): string {
  const year = new Date().getFullYear();
  const random4Digit = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random4Digit}`;
}
