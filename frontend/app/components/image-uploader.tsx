"use client"

import { useState } from "react"
import { UploadButton } from "./utils/uploadthings"
import { notify } from "./notification/Notify";
import Image from "next/image";
import { useImage } from "./utils/context/ImageContext";

const ImpageUpload = () =>{
    const { imageUrl, setImageUrl } = useImage();   //uzywa zmiennej do stworzenia contextu
    //new image URL powinien zostac zapisany w bazie danych
    // trzeba edytowac baze w takim razie
    return <div>
        <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
            setImageUrl(res[0].url);
            notify(`Image has been uploaded corectly`)
            
            }}
            onUploadError={(error: Error) => {
            notify(`ERROR! ${error.message}`);
            }}
      />
        {imageUrl?.length ? (
            <div>
                <Image src={imageUrl} alt="Avatar" width={300} height={300} />
            </div>
        ) : null}

    </div>
}

export default ImpageUpload