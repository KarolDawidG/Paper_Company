import { Order } from "./InterfaceOrder";

export interface OrderTableContentProps {
  data: Order[];
  page: number;
  rowsPerPage: number;
  filteredData: Order[];
  handleDeleteOrder: (id: string) => void;
  handleOpenDetails: (order: Order) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortDirection: 'asc' | 'desc';
  toggleSort: (column: keyof Order) => void;
  sortColumn: keyof Order | null;
}
