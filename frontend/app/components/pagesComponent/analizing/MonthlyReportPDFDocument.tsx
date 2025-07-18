import React from "react";
import { stylesDoc } from "../accounting/Cards/SecondCard/utils/stylesPdf";
import { Document, Page, Text, View } from "@react-pdf/renderer";

interface Item {
  name: string;
  quantity: number;
  value?: number;
}

interface Prediction {
  month: string;
  profit: number;
}

interface Props {
  t: any;
  profit: number;
  clients: Item[];
  sellers: Item[];
  products: { name: string; quantity: number }[];
  predictions: Prediction[];
}

export const MonthlyReportPDFDocument: React.FC<Props> = ({ t, profit, clients, sellers, products, predictions }) => {
  return (
    <Document>
      <Page size="A4" style={stylesDoc.page}>

        <View style={stylesDoc.header}>
            <Text style={stylesDoc.heading}>ERP Paper Company</Text>
            <Text style={stylesDoc.heading}>{t.pdf?.monthly_summary || "Miesięczne podsumowanie"}</Text>
        </View>


        <View style={stylesDoc.section}>
          <Text style={stylesDoc.sectionTitle}>{t.pdf?.report_month || "Miesiąc raportu"}: {predictions?.[predictions.length - 1]?.month}</Text>
          <Text>{t.pdf?.total_profit || "Całkowity zysk"}: {profit.toFixed(2)} zł</Text>
        </View>

        <View style={stylesDoc.section}>
          <Text style={stylesDoc.sectionTitle}>{t.pdf?.top_clients || "Top Klienci"}:</Text>

        <View style={stylesDoc.table}>
            <View style={stylesDoc.tableHeader}>
                <Text style={stylesDoc.cellHeader}>Nazwa</Text>
                <Text style={stylesDoc.cellHeader}>Ilość</Text>
                <Text style={stylesDoc.cellHeader}>Wartość</Text>
            </View>
            {clients.map((c, i) => (
                <View key={i} style={stylesDoc.tableRow}>
                <Text style={stylesDoc.cell}>{c.name}</Text>
                <Text style={stylesDoc.cell}>{c.quantity}</Text>
                <Text style={stylesDoc.cell}>{c.value?.toFixed(2)} zł</Text>
                </View>
            ))}
        </View>

        </View>

        <View style={stylesDoc.section}>
          <Text style={stylesDoc.sectionTitle}>{t.pdf?.top_sellers || "Top Sprzedawcy"}:</Text>
            <View style={stylesDoc.table}>
                <View style={stylesDoc.tableHeader}>
                    <Text style={stylesDoc.cellHeader}>Nazwa</Text>
                    <Text style={stylesDoc.cellHeader}>Ilość</Text>
                    <Text style={stylesDoc.cellHeader}>Wartość</Text>
                </View>
                {sellers.map((s, i) => (
                    <View key={i} style={stylesDoc.tableRow}>
                    <Text style={stylesDoc.cell}>{s.name}</Text>
                    <Text style={stylesDoc.cell}>{s.quantity}</Text>
                    <Text style={stylesDoc.cell}>{s.value?.toFixed(2)} zł</Text>
                    </View>
                ))}
            </View>
        </View>

        <View style={stylesDoc.section}>
          <Text style={stylesDoc.sectionTitle}>{t.pdf?.top_products || "Top Produkty"}:</Text>
            <View style={stylesDoc.table}>
                <View style={stylesDoc.tableHeader}>
                    <Text style={stylesDoc.cellHeader}>Nazwa</Text>
                    <Text style={stylesDoc.cellHeader}>Ilość</Text>
                </View>
                {products.map((p, i) => (
                    <View key={i} style={stylesDoc.tableRow}>
                        <Text style={stylesDoc.cell}>{p.name}</Text>
                        <Text style={stylesDoc.cell}>{p.quantity}</Text>
                    </View>
                ))}
            </View>
        </View>
        
        <View style={stylesDoc.section}>
          <Text style={stylesDoc.sectionTitle}>{t.pdf?.profit_forecast || "Prognoza zysków"}:</Text>
          {predictions.map((p, i) => (
            <Text key={i}>{p.month}: {p.profit.toFixed(2)} zł</Text>
          ))}
        </View>

        <View style={stylesDoc.footer}>
            <Text>{t.pdf?.generated}{new Date().toLocaleDateString("pl-PL")}</Text>
        </View>

      </Page>
    </Document>
  );
};
