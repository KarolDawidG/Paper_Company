import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(async ({ req }) => {

      const userID = localStorage.getItem('idUser');
      if(!userID) throw new Error("Unauthorized")

      return {userID}
    })
    .onUploadComplete(async ({ metadata, file }) => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;