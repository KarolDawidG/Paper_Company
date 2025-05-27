  export interface Products {
    id: string;
    name: string;
    description: string;
    category: string;
    price:number;  
    stock:number;  
    created_at:string;    
  }

    export interface ProductsData {
    productsData: Products[];
  }

    export interface TablePropsProducts {
    data?: Products[];
  }