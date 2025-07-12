import React, { useState } from "react";
import {Page, Text, View, Document} from "@react-pdf/renderer";
import { styles } from "./stylesPdf";
import { InvoiceItem } from "./InvoiceItem";


export const sampleData: InvoiceItem[] = [
  { productName: "Papier ksero A4", quantity: 10, unitPrice: 12.5 },
  { productName: "Segregator biurowy", quantity: 5, unitPrice: 7.99 },
  { productName: "Teczka kartonowa", quantity: 20, unitPrice: 1.45 },
];

// Komponent PDF
export const GeneratorPDF = ({ items }: { items: InvoiceItem[] }) => {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Faktura VAT</Text>
        <View style={styles.itemRow}>
          <Text style={styles.bold}>Produkt</Text>
          <Text style={styles.bold}>Ilość x Cena</Text>
        </View>
        {items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text>{item.productName}</Text>
            <Text>
              {item.quantity} x {item.unitPrice.toFixed(2)} zł
            </Text>
          </View>
        ))}
        <Text style={styles.total}>Razem: {totalAmount.toFixed(2)} zł</Text>
      </Page>
    </Document>
  );
};

// Komponent React z Tailwindem
// export const ExportInvoicePdf: React.FC = () => {
//   const [fileName, setFileName] = useState("faktura.pdf");

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4 text-center">Generator faktury PDF</h2>

//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Nazwa pliku:
//         </label>
//         <input
//           type="text"
//           value={fileName}
//           onChange={(e) => setFileName(e.target.value)}
//           className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <PDFDownloadLink
//           document={<InvoiceDocument items={sampleData} />}
//           fileName={fileName}
//         >
//           {({ loading }) =>
//             loading ? (
//               <button className="w-full bg-blue-300 text-white py-2 rounded">
//                 Generowanie PDF...
//               </button>
//             ) : (
//               <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
//                 Pobierz fakturę PDF
//               </button>
//             )
//           }
//         </PDFDownloadLink>
//       </div>
//     </div>
//   );
// };
