import { pool } from "../../pool";
import { v4 as uuidv4 } from "uuid";

class InvoiceRecord {
  static async insert(orderId: string, invoiceNumber: string, pdfBuffer: Buffer) {
    const id = uuidv4();
    const query = `
      INSERT INTO invoices (id, order_id, invoice_number, pdf)
      VALUES (?, ?, ?, ?)
    `;
    await pool.execute(query, [id, orderId, invoiceNumber, pdfBuffer]);
  }
}

export { InvoiceRecord };
