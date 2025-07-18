import '../fonts'; 
import {StyleSheet} from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  heading: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #ccc",
    paddingVertical: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  total: {
    marginTop: 20,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
  },
});


export const stylesDoc = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Roboto' },
  sectionTitle: {
  color: '#2c3e50',
  borderBottom: '1pt solid #2c3e50',
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 8,
  // borderBottom: '1pt solid #666',
  paddingBottom: 4,
},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 40,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    flexGrow: 1,
  },
  section: { marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    borderBottom: "1px solid #ccc",
  },
  bold: { fontWeight: "bold", marginBottom: 4 },
  total: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "right",
    fontWeight: "bold",
  },
  signature: {
    marginTop: 40,
    alignItems: 'flex-end',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    right: 40,
    color: 'grey',
  },
  table: { width: "auto", marginTop: 10 },
  tableRow: { flexDirection: "row", borderBottom: "1pt solid #ccc" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f0f0", borderBottom: "1pt solid #999" },
  cellHeader: { flex: 1, fontWeight: "bold", padding: 4, fontSize: 10 },
  cell: { flex: 1, padding: 4, fontSize: 10 },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: 'grey',
    textAlign: 'center',
    borderTop: '1pt solid #ccc',
    paddingTop: 4,
  },
});
