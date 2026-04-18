import { useState, useEffect } from "react";
import { UserData } from "@/app/components/interface/userDataInterface";
import { notify } from "@/app/components/notification/Notify";
import axiosInstance from "@/app/api/axiosInstance";
import useTranslationStatus from "../../language/useTranslationStatus";
import useTranslation from "../../language/useTranslation";

const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [id, setUserId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({username: "", email: "",});
  const storedUserId = localStorage.getItem("idUser");

  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const isTranslationLoaded = useTranslationStatus(currentLocale);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserId(storedUserId);
        // 27.6.6: Dashboard czyta i zapisuje dane zawsze względem zalogowanego idUser.
        const response = await axiosInstance.get(`/users/user/${storedUserId}`);
        setUserData(response.data);
      } catch (error) {
        if (isTranslationLoaded) {
          notify(`${t.notification.error_data}`);
        }
      }
    };

    if (isTranslationLoaded) {
      fetchUserData();
    }
  }, [isTranslationLoaded]);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedData({
      username: userData?.username || "",
      email: userData?.email || "",
    });
  };

  const handleSaveClick = async () => {
    if (!id) {
      return;
    }
    try {
      setUserData((prevUserData) => ({
        ...prevUserData!,
        username: editedData.username,
        email: editedData.email,
      }));
      const response = await axiosInstance.put(`/users/${id}`, editedData);
      setEditMode(false);
      if (isTranslationLoaded) {
        notify(`${t.notification.data_added}`);
      }
    } catch (error) {
      if (isTranslationLoaded) {
        notify(`${t.notification.error_data}`);
      }
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
