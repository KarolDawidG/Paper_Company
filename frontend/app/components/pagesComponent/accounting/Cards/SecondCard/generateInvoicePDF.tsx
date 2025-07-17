import ".fonts/fonts";
import { renderToBuffer } from "@react-pdf/renderer";
import { GeneratorPDF } from "./GeneratorPDF";
import { GeneratorPDFProps } from "./Interface/ProductInterface";
import useTranslation from "@/app/components/language/useTranslation";

export const generateInvoicePDF = async (
  props: GeneratorPDFProps & { signed?: boolean; locale?: string }
): Promise<Buffer> => {
  const locale = props.locale || "pl";
  const t = useTranslation(locale);

  const doc = (
    <GeneratorPDF
      {...props}
      signed={props.signed}
      t={t}
    />
  );

  const pdfBuffer = await renderToBuffer(doc);
  return pdfBuffer;
};
