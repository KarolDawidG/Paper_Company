import { useState } from "react";
import { UploadDropzone } from "./utils/uploadthings";
import { notify } from "./notification/Notify";
import Image from "next/image";
import { useImage } from "./utils/context/ImageContext";
import { Typography, Box, Button } from "@mui/material";
import DeleteImageButton from "./DeleteImageButton";

const ImpageUpload = () => {
  const { imageUrl, setImageUrl } = useImage();
  const [showDropzone, setShowDropzone] = useState(true);
  const [imageKey, setImageKey] = useState<string | undefined>();

  const handleClientUploadComplete = async (res: any) => {
    const newImageUrl = res[0].url;
    const newImageKey = res[0].key;
    setImageUrl(newImageUrl);
    setImageKey(newImageKey); 
    notify("Image has been uploaded correctly");
    setShowDropzone(false);
  };

  return (
    <div>
      {imageUrl ? (
        <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
          <Image src={imageUrl} alt="Avatar" width={200} height={200} />
          <DeleteImageButton imageKey={imageKey} />
        </Box>
      ) : (
        <div>
          {showDropzone ? (
            <Box>
              <Box
                display="flex"
                marginTop={1}
                alignItems="center"
                mb={2}
              >
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
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ImpageUpload;
