import { PDFDownloadLink } from "@react-pdf/renderer";
import { useState } from "react";
import { GeneratorPDF, sampleData } from "./GeneratorPDF";


    
export const ExportInvoicePdf: React.FC = () => {
  const [fileName, setFileName] = useState("faktura.pdf");


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Generator faktury PDF</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nazwa pliku:
        </label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <PDFDownloadLink
          document={<GeneratorPDF items={sampleData} />}
          fileName={fileName}
        >
          {({ loading }) =>
            loading ? (
              <button className="w-full bg-blue-300 text-white py-2 rounded">
                Generowanie PDF...
              </button>
            ) : (
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                Pobierz fakturę PDF
              </button>
            )
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
};