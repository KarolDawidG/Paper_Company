import { useState } from "react";

interface ClientTableLogicProps {
    fetchData: () => Promise<void>;
}

export const useClientTableLogic = ({ fetchData }: ClientTableLogicProps) => {
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [updateData, setUpdateData] = useState({
        id: "",
        first_name: "",
        second_name: "",
        email: "",
    });

    const [modals, setModals] = useState({
        addClient: false,
        editClient: false,
        addAddress: false,
    });

    const handleOpenAddClient = () => {
        toggleModal("addClient", true);
    };

    const handleOpenAddAddress = () => {
        toggleModal("addAddress", true);
    };

    const handleOpenEditClient = (id: string, first_name: string, second_name: string, email: string) => {
        setUpdateData({ id, first_name, second_name, email });
        toggleModal("editClient", true);
    };

    const handleIdClient = (clientId: number) => {
        setSelectedClientId(clientId);
        sessionStorage.setItem("clientId", clientId.toString());
        sessionStorage.removeItem('addressId');
    };

    const toggleModal = (modalName: string, value: boolean) => {
        setModals(prev => ({ ...prev, [modalName]: value }));
    };

    return {
        selectedClientId,
        setSelectedClientId,
        updateData,
        modals,
        handleOpenAddClient,
        handleOpenAddAddress,
        handleOpenEditClient,
        handleIdClient,
        toggleModal
    };
};
