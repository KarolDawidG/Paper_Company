import { useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { notify } from "@/app/components/notification/Notify";

interface DeleteClientDialogLogicProps {
    fetchData: () => Promise<void>;
}

export const useDeleteClientDialogLogic = ({ fetchData }: DeleteClientDialogLogicProps) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

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
                notify("Client successfully deleted.");
                handleCloseDeleteDialog();
                fetchData();
            } catch (error: any) {
                notify("An error occurred while trying to delete the client. Try again later.");
                console.error(error);
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
