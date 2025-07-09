export interface Order {
    id: string;
    client_id: string;
    client_address_id: string;
    account_id: string; // dodaj tę linię
    created_at: string;
    status: string;
    payment_status: string;
    payment_date: string;
}
