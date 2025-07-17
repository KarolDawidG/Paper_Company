
import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { stylesDoc } from "./utils/stylesPdf";
import { GeneratorPDFProps } from "./Interface/ProductInterface";


interface Props extends GeneratorPDFProps {
  signed?: boolean;
  t: any;
}

export const GeneratorPDF: React.FC<Props> = ({
  items = [],
  address = null,
  total = 0,
  orderId,
  clientId,
  signed = false,
  t,
}) => {
  if (!t || !t.pdf) {
    return (
      <Document>
        <Page size="A4" style={stylesDoc.page}>
          <Text>Loading PDF...</Text>
        </Page>
      </Document>
    );
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const net = total / 1.23;
  const vat = total - net;

  return (
    <Document>
      <Page size="A4" style={stylesDoc.page}>
        {/* Nagłówek */}
        <View style={stylesDoc.header}>
          <Text style={stylesDoc.heading}>{t.pdf.title}</Text>
        </View>

        {/* Informacje o zamówieniu */}
        <View style={stylesDoc.section}>
          {orderId && <Text>{t.pdf.order_number}: {orderId}</Text>}
          {clientId && <Text>{t.pdf.client_id}: {clientId}</Text>}
          <Text>{t.pdf.issue_date}: {new Date().toLocaleDateString("pl-PL")}</Text>
        </View>

        {/* Dane klienta */}
        {address && (
          <View style={stylesDoc.section}>
            <Text style={stylesDoc.bold}>{t.pdf.company_data}:</Text>
            <Text>{address.nazwa_firmy}</Text>
            <Text>{address.ulica} {address.nr_budynku}/{address.nr_mieszkania}</Text>
            <Text>{address.kod} {address.miasto}</Text>
          </View>
        )}

        {/* Produkty */}
        <View style={stylesDoc.section}>
          <Text style={stylesDoc.bold}>{t.pdf.product_list}:</Text>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <View key={idx} style={stylesDoc.row}>
                <Text>{item.product_name}</Text>
                <Text>{item.quantity} × {item.price.toFixed(2)} PLN</Text>
              </View>
            ))
          ) : (
            <Text>{t.pdf.no_products}</Text>
          )}
        </View>

        {/* Podsumowanie ilościowe */}
        <View style={stylesDoc.section}>
          <Text>{t.pdf.item_count}: {items.length}</Text>
          <Text>{t.pdf.total_quantity}: {totalQuantity}</Text>
        </View>

        {/* Podsumowanie finansowe */}
        <View style={stylesDoc.section}>
          <Text>{t.pdf.net}: {net.toFixed(2)} PLN</Text>
          <Text>{t.pdf.vat}: {vat.toFixed(2)} PLN</Text>
          <Text style={stylesDoc.total}>{t.pdf.gross}    {total.toFixed(2)} PLN</Text>
        </View>

        {/* Podpis */}
        <View style={stylesDoc.signature}>
          <Text>..........................................</Text>
          <Text>{t.pdf.signature}</Text>
        </View>

        {/* E-podpis */}
        {signed && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 12, color: 'green', textAlign: 'right' }}>
              {t.pdf.signature_acctepted} {new Date().toLocaleDateString("pl-PL")}
            </Text>
          </View>
        )}

        {/* Numeracja */}
        <Text
          style={stylesDoc.pageNumber}
          render={({ pageNumber, totalPages }) => `${t.pdf.page} ${pageNumber} z ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};
