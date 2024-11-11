import fs from 'fs';
import path from 'path';


export const saveOrderDetailsToFile = (orderDetails: any, orderId: string): void =>{
  const orderDir = path.join(__dirname, '..', 'orderDocuments');
    if (!fs.existsSync(orderDir)) {
        fs.mkdirSync(orderDir, { recursive: true });
    }
  const filePath = path.join(orderDir, `order_id_${orderId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(orderDetails, null, 2));
}
