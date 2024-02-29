import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { firebaseConfig } from "./uploadImage";
import { initializeApp } from "firebase/app";
import { userDetails } from "../types/types";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getUserDoc(username: string) {
  try {
    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUsers() {
  const collRef = collection(db, "users");
  const collSnap = await getDocs(collRef);
  let users: userDetails[] = [];
  collSnap.forEach((doc) => {
    users.push(doc.data() as userDetails);
  });
  return users;
}

export default getUserDoc;
