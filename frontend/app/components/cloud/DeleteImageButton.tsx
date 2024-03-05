import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { notify } from "../notification/Notify";
import axios from "axios";
import axiosInstance from "@/app/api/axiosInstance";
import { useImage } from "../utils/context/ImageContext";
import { ImageContextType } from "../utils/context/ImageContextType";

const DeleteImageButton = () => {
  const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;
  const MAIN_AVATAR: string = '/main_avatar.jpg';
  const { imageUrl, setImageUrl } = useImage() as ImageContextType;
  const imageKeyXX = imageUrlToImageKey(imageUrl);

  function imageUrlToImageKey(imageUrl: any): string | null {
    if (!imageUrl) {
      return null;
    }
    const key = imageUrl.replace('https://utfs.io/f/', '');
    return key;
  }

  const handleDeleteImage = async () => {
    try {
      //usuwanie z uploadthing
        await axios.delete("api/uploadthing", {
          data: {
            url: imageKeyXX,
          },
        });
      //usuwanie z localstorage
        localStorage.removeItem('image');
        const idUser = localStorage.getItem('idUser');
      //usuwanie z bazy danych
        await axiosInstance.delete(`${BACKEND}/url/${idUser}`);
        setImageUrl(MAIN_AVATAR);
        notify("Avatar zostal usuniety")
    } catch (error: any) {
        console.error("Error deleting image:", error);
        notify(`Error deleting image: ${error.message}`);
    }
  };

  return (
    <div>
      <Button
        sx={{ marginTop: 2 }}
        variant="contained"
        onClick={handleDeleteImage}
      >
        Delete Image
      </Button>
    </div>
  );
};

export default DeleteImageButton;
