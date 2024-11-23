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
  }