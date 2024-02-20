import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.API_KEY,
  authDomain: import.meta.env.AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.MEASUREMENT_ID,
  appId: import.meta.env.APP_ID,
  measurementId: import.meta.env.MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

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
