// GeneratorPDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface Product {
  product_name: string;
  quantity: number;
  price: number;
}

interface Address {
  nazwa_firmy: string;
  miasto: string;
  kod: string;
  ulica: string;
  nr_budynku: string;
  nr_mieszkania: string;
}

interface GeneratorPDFProps {
  items?: any[]; // <-- teraz opcjonalne
  address?: Address | null;
  total?: any;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  heading: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  section: { marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    borderBottom: "1px solid #ccc",
  },
  bold: { fontWeight: "bold" },
  total: { marginTop: 20, fontSize: 14, textAlign: "right", fontWeight: "bold" },
});

export const GeneratorPDF: React.FC<GeneratorPDFProps> = ({
                                                            items = [],
                                                            address = null,
                                                            total = 0
                                                          }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* <Text style={styles.heading}>Szczegóły zamówienia</Text> */}

        {/* {address && (
          <View style={styles.section}>
            <Text style={styles.bold}>Dane firmy:</Text>
            <Text>{address.nazwa_firmy}</Text>
            <Text>
              {address.ulica} {address.nr_budynku}/{address.nr_mieszkania}
            </Text>
            <Text>CIPA
              ddddddddddddddddddddddddddddd
            </Text>
          </View>
        )} */}

        {/* <View style={styles.section}>
          <Text style={styles.bold}>Produkty:</Text>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <View key={idx} style={styles.row}>
                <Text>{item.product_name}</Text>
                <Text>
                  {item.quantity} x {item.price.toFixed(2)} PLN
                </Text>
              </View>
            ))
          ) : (
            <Text>Brak produktów</Text>
          )}
        </View> */}


        {/* <Text style={styles.total}>Razem: {total.toFixed(2)} PLN</Text> */}
      </Page>
    </Document>
  );
};
