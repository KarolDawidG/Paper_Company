import { useState } from "react";
import { UploadDropzone } from "../utils/uploadthings";
import { notify } from "../notification/Notify";
import { useImage } from "../utils/context/ImageContext";
import { Typography, Box, LinearProgress } from "@mui/material";
import DeleteImageButton from "./DeleteImageButton";
import axiosInstance from "@/app/api/axiosInstance";
import { ImageContextType } from "../utils/context/ImageContextType";
import { MAIN_AVATAR } from "../utils/links";
import useTranslation from "@/app/components/language/useTranslation";
import Image from "next/image";

const ImpageUpload = () => {
  const { imageUrl, setImageUrl } = useImage() as ImageContextType;
  const [dropImage, setDropImage] = useState<string>(MAIN_AVATAR);
  const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;

  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);

  const handleClientUploadComplete = async (res: any) => {
    const storedLocale = localStorage.getItem("idUser");
    const newImageUrl: any = res[0].url;
    setImageUrl(newImageUrl);
    setDropImage(newImageUrl);
    try {
      await axiosInstance.put(`${BACKEND}/url/${storedLocale}`, {
        img_url: newImageUrl,
      });
      //TODO: useTranslationStatus - there may be errors if it is not added
      notify(`${t.notification.image_sent}`);
    } catch (error: any) {
      console.error("Error:", error);
      notify(`${t.notification.error}! ${error.message}`);
    }
  };

  if (!t.dashboard) {
    return <LinearProgress />;
  }
  
  return (
    <div>
      <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
        <Image
          src={imageUrl || dropImage}
          alt="Avatar"
          width={150}
          height={150}
          loading="eager"
        />
        <DeleteImageButton />
      </Box>
      <Box>
        <Box display="flex" marginTop={1} alignItems="center" mb={2}>
          <Typography variant="h6" ml={2}>
            {t.dashboard.edit_photo}
          </Typography>
        </Box>
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={handleClientUploadComplete}
          onUploadError={(error: Error) => {
            notify(`${t.notification.error}! ${error.message}`);
          }}
        />
      </Box>
    </div>
  );
};

export default ImpageUpload;
