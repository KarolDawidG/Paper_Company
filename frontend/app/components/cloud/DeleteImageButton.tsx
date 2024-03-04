import { useRouter } from 'next/router'; 
import { Button } from "@mui/material";
import { notify } from "../notification/Notify";
import axios from "axios";

interface DeleteImageButtonProps {
    imageKey?: string;
  }

const DeleteImageButton = ({ imageKey }: DeleteImageButtonProps)  => {
    const router = useRouter();
    const handleDeleteImage = async () => {
        try {
            await axios.delete("api/uploadthing", {
                data: {
                url: imageKey,
                },
            });
        
        //na razie tak
        router.reload();
    } catch (error:any) {
      console.error("Error deleting image:", error);
      notify(`Error deleting image: ${error.message}`);
    }
  };

  return (
    <div>
      <Button sx={{ marginTop: 2 }} variant="contained" onClick={handleDeleteImage}>
        Delete Image
      </Button>
    </div>
  );
};

export default DeleteImageButton;
