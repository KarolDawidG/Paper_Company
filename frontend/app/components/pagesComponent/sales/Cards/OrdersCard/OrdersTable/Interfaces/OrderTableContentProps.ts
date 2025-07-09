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
  setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  sortColumn: 'company_name' | 'created_at';
  setSortColumn: React.Dispatch<React.SetStateAction<'company_name' | 'created_at'>>;
}
