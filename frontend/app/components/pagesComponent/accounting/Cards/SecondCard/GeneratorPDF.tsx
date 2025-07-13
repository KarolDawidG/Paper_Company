import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { stylesDoc } from "./utils/stylesPdf";
import { GeneratorPDFProps } from "./Interface/ProductInterface";

export const GeneratorPDF: React.FC<GeneratorPDFProps & { signed?: boolean }> = ({
  items = [],
  address = null,
  total = 0,
  orderId,
  clientId,
  signed = false,
}) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const net = total / 1.23;
  const vat = total - net;

  return (
    <Document>
      <Page size="A4" style={stylesDoc.page}>
        {/* Nagłówek */}
        <View style={stylesDoc.header}>
          <Text style={stylesDoc.heading}>Faktura / Szczegóły zamówienia</Text>
        </View>

        {/* Informacje o zamówieniu */}
        <View style={stylesDoc.section}>
          {orderId && <Text>Numer zamówienia: {orderId}</Text>}
          {clientId && <Text>ID klienta: {clientId}</Text>}
          <Text>Data wystawienia: {new Date().toLocaleDateString("pl-PL")}</Text>
        </View>

        {/* Dane adresowe klienta */}
        {address && (
          <View style={stylesDoc.section}>
            <Text style={stylesDoc.bold}>Dane firmy:</Text>
            <Text>{address.nazwa_firmy}</Text>
            <Text>
              {address.ulica} {address.nr_budynku}/{address.nr_mieszkania}
            </Text>
            <Text>{address.kod} {address.miasto}</Text>
          </View>
        )}

        {/* Lista produktów */}
        <View style={stylesDoc.section}>
          <Text style={stylesDoc.bold}>Lista produktów:</Text>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <View key={idx} style={stylesDoc.row}>
                <Text>{item.product_name}</Text>
                <Text>{item.quantity} × {item.price.toFixed(2)} PLN</Text>
              </View>
            ))
          ) : (
            <Text>Brak produktów</Text>
          )}
        </View>

        {/* Podsumowanie ilościowe */}
        <View style={stylesDoc.section}>
          <Text>Liczba pozycji: {items.length}</Text>
          <Text>Łączna liczba sztuk: {totalQuantity}</Text>
        </View>

        {/* Podsumowanie finansowe */}
        <View style={stylesDoc.section}>
          <Text>Wartość netto: {net.toFixed(2)} PLN</Text>
          <Text>Podatek VAT (23%): {vat.toFixed(2)} PLN</Text>
          <Text style={stylesDoc.total}>Do zapłaty (brutto): {total.toFixed(2)} PLN</Text>
        </View>

        {/* Podpis */}
        <View style={stylesDoc.signature}>
          <Text>..........................................</Text>
          <Text>Podpis osoby wystawiającej dokument</Text>
        </View>

        {/* Informacja o podpisie elektronicznym */}
        {signed && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 12, color: 'green', textAlign: 'right' }}>
              Podpisano elektronicznie dnia {new Date().toLocaleDateString("pl-PL")}
            </Text>
          </View>
        )}

        {/* Numeracja stron */}
        <Text
          style={stylesDoc.pageNumber}
          render={({ pageNumber, totalPages }) => `Strona ${pageNumber} z ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};
