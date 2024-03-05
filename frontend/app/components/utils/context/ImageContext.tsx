import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ImageContextType } from "./ImageContextType";
import { MAIN_AVATAR } from "../links";

const ImageContext = createContext<ImageContextType | string>(MAIN_AVATAR);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({children}) => {
  const [imageUrl, setImageUrl] = useState<string | any>(MAIN_AVATAR);
  
  useEffect(() => {
    const savedImage = localStorage.getItem('image');
      if (savedImage) {
        setImageUrl(savedImage);
      }
  }, []); 

  useEffect(() => {
    localStorage.setItem('image', imageUrl);
  }, [imageUrl]);

  return (
    <ImageContext.Provider value={{ imageUrl, setImageUrl }}>
      {children}
    </ImageContext.Provider>
  );
};

//ustawia dana zmienna jako context
export const useImage = () => {
  const context = useContext(ImageContext);

  if (!context) {
    throw new Error("useImage must be used within an ImageProvider");
  }
  return context;
};
