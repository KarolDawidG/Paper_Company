// ImageContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';

type ImageContextType = {
  imageUrl: string | null;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};
