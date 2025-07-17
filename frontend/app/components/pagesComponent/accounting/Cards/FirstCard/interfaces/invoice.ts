export type Invoice = {
  client_address_id: string;
  client_id: string | undefined;
  id: string;
  order_id: string;
  invoice_number: string;
  created_at: string;
  payment_status: "unpaid" | "waiting" | "paid" | "overdue";
  payment_date?: string | null;
};

export type InvoiceProps = {
  filteredData: Invoice[];
  page: number;
  rowsPerPage: number;
  handleStatusChange: (id: string, newStatus: Invoice["payment_status"]) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  paymentStatuses: string[];
  handleShowOrderDetails: (value: string) => void;
};

export interface OrderDetail {
  order_id: string;
  created_at: string;
  status: string;
  payment_status: string;
  payment_date: string | null;
  account_id: string | null;
  client_id: string;
  company_name: string;
  first_name: string;
  second_name: string;
  email: string;
  miasto: string;
  ulica: string;
  nr_budynku: string;
  nr_mieszkania: string | null;
  kod: string;
  nazwa_firmy: string | null;
  product_id: string;
  product_name: string;
  translated_name: string | null;
  price: number;
  quantity: number;
}