export interface Product {
  product_name: string;
  quantity: number;
  price: number;
}

export interface Address {
  nazwa_firmy: string;
  miasto: string;
  kod: string;
  ulica: string;
  nr_budynku: string;
  nr_mieszkania: string;
}

export interface GeneratorPDFProps {
  items: Product[];
  address: any;
  total: number;
  orderId?: string;
  clientId?: string;
  signed?: boolean;
}
