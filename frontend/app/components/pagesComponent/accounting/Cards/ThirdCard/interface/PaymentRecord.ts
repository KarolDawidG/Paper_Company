export interface PaymentRecord {
  invoice_number: string;
  invoice_date: string;
  payment_date: string | null;
  payment_status: string;
  company_name: string;
  total: number;
}