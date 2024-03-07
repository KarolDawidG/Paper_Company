import { useState, useEffect } from "react";
import { UserData } from "@/app/components/interface/userDataInterface";
import { notify } from "@/app/components/notification/Notify";
import axiosInstance from "@/app/api/axiosInstance";

const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [id, setUserId] = useState<string | null>();
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const idUser: string | null = localStorage.getItem("idUser");
    setUserId(idUser);

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${idUser}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Nie udało się pobrać danych użytkownika.", error);
        notify("Nie udało się pobrać danych użytkownika.");
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedData({
      username: userData?.username || "",
      email: userData?.email || "",
    });
  };

  const handleSaveClick = async () => {
    try {
      setUserData((prevUserData) => ({
        ...prevUserData!,
        username: editedData.username,
        email: editedData.email,
      }));
      const response = await axiosInstance.put(`/users/${id}`, editedData);
      setEditMode(false);
      notify(response.data);
    } catch (error) {
      console.error("Nie udało się zapisać zmian.", error);
      notify("Nie udało się zapisać zmian.");
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return {
    userData,
    editMode,
    editedData,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleInputChange,
  };
};

export default useUserData;
