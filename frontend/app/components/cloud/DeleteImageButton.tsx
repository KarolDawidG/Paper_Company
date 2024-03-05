import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { notify } from "../notification/Notify";
import axios from "axios";
import axiosInstance from "@/app/api/axiosInstance";

interface DeleteImageButtonProps {
  imageKey?: string;
}

const DeleteImageButton = ({ imageKey }: DeleteImageButtonProps) => {
  const BACKEND: string = process.env.NEXT_PUBLIC_BACKEND as string;
  const router = useRouter();
  const handleDeleteImage = async () => {
    try {
      await axios.delete("api/uploadthing", {
        data: {
          url: imageKey,
        },
      });
      const idUser = localStorage.getItem('idUser');
      await axiosInstance.delete(`${BACKEND}/url/${idUser}`);
      //na razie tak
      //router.reload();
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
