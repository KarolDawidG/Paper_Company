import { Mail } from "./MailInterface";

export interface EmailListContentProps {
    paginatedEmails: Mail[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    handleEmailClick: (email: Mail) => void;
    handleDeleteClick: (emailId: string, event: React.MouseEvent) => void;
  }