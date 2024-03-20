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
import { StreamChat } from "stream-chat";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * method to get user data from backend
 * @param {String} username
 * @returns {Promise<userDetails>} returns a promise that resolves to the user details
 */
async function getUserDoc(username: string) {
  try {
    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    console.log(error);
  }
}

/**
 * Asynchronous method to retrieve all users from firestore backend
 * @returns {userDetails[]}  an array of all users.
 */
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
