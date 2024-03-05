import { useState } from "react";
import { UploadDropzone } from "../utils/uploadthings";
import { notify } from "../notification/Notify";
import Image from "next/image";
import { useImage } from "../utils/context/ImageContext";
import { Typography, Box, Button } from "@mui/material";
import DeleteImageButton from "./DeleteImageButton";
import axiosInstance from "@/app/api/axiosInstance";
import { ImageContextType } from "../utils/context/ImageContextType";

const ImpageUpload = () => {
  const { imageUrl, setImageUrl } = useImage() as ImageContextType;
  const MAIN_AVATAR: string = '/main_avatar.jpg';
  const [dropImage, setDropImage] = useState<string>(MAIN_AVATAR);
  const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;
  
  const handleClientUploadComplete = async (res: any) => {
    const storedLocale = localStorage.getItem("idUser");
    const newImageUrl:any = res[0].url;
    setImageUrl(newImageUrl);
    setDropImage(newImageUrl);
      try {
        await axiosInstance.put(`${BACKEND}/url/${storedLocale}`, {
          img_url: newImageUrl,
        });
      
        notify('Obrazek przeslany')
      } catch (error: any) {
        console.error("Error:", error);
        notify(`ERROR! ${error.message}`);
      }
  };

  return (
    <div>
      <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
        <img src={imageUrl || dropImage} alt="Avatar" width={150} height={150} loading="eager"/>
        <DeleteImageButton />
      </Box>
      <Box>
        <Box display="flex" marginTop={1} alignItems="center" mb={2}>
          <Typography variant="h6" ml={2}>
            Edycja zdjecia profilowego
          </Typography>
      </Box>
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={handleClientUploadComplete}
            onUploadError={(error: Error) => {
            notify(`ERROR! ${error.message}`);
            }}
          />
      </Box>
    </div>
  );
};

export default ImpageUpload;
