import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MEASUREMENT_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

/**
 * Method to upload user image to firebase storage bucket.
 * @param {File} imageUpload - image file to upload
 * @param {string} username - username to construct storage path
 * @param {string} pathUrl - base path url in firebase storage
 * @returns {Promise<String>} - A promise that resolves to the download URL of the uploaded image.
 */
export default async function uploadImage(imageUpload: File, username: string, pathUrl:string) {
  if (imageUpload) {
    const imageRef = ref(
      storage,
      `${pathUrl}${username}`
    );
    await uploadBytes(imageRef, imageUpload);
    const pathRef = ref(storage, `${pathUrl}${username}`);
    const url = await getDownloadURL(pathRef)
    return url
  }
}
