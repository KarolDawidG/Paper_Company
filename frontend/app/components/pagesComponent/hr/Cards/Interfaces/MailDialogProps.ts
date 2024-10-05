import { Mail } from "./MailInterface";

export interface MailDialogProps {
    open: boolean;
    email: Mail | null;
    onClose: () => void;
  }
  