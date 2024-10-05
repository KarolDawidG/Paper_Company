import { useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";
import useTranslation from "@/app/components/language/useTranslation";
import useTranslationStatus from "@/app/components/language/useTranslationStatus";

interface DeleteClientDialogLogicProps {
    fetchData: () => Promise<void>;
}

export const useDeleteClientDialogLogic = ({ fetchData }: DeleteClientDialogLogicProps) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

    const currentLocale = localStorage.getItem("locale") || "en";
    const t = useTranslation(currentLocale);
    const isTranslationLoaded = useTranslationStatus(currentLocale);
  
    const handleOpenDeleteDialog = (clientId: number) => {
        setSelectedClientId(clientId);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDelete = async () => {
        if (selectedClientId) {
            try {
                await axiosInstance.delete(`/client/${selectedClientId}`);
                handleCloseDeleteDialog();
                fetchData();
                if (isTranslationLoaded) {
                    notify(`${t.notification.correct}`);
                    return;
                }
            } catch (error: any) {
                console.error(error);
                    if (isTranslationLoaded) {
                        notify(`${t.notification.deleting_error}`);
                        return;
                    }
            }
        }
    };

    return {
        openDeleteDialog,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleDelete
    };
};
