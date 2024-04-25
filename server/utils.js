import {
  doc,
  getDoc,
  query,
  getDocs,
  collection,
  where,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import {
  scryptSync,
  randomFill,
  createCipheriv,
  createDecipheriv,
} from "crypto";

/**
 * checks if document exists
 * @param {*} username
 * @param {*} db
 * @returns {docSnapShot<DocumentData, DocumentData>}
 */
export default async function checkDocumentExists(username, db) {
  const docRef = doc(db, "users", username);
  const docSnapShot = await getDoc(docRef);
  return docSnapShot.exists();
}

/**
 * Method to get user data
 * @param {*} email
 * @param {*} db
 * @returns {Object} object containing user details
 */
export async function getUserData(email, db) {
  const collectionRef = collection(db, "users");
  const q = query(collectionRef, where("email", "==", email));
  const querySnap = await getDocs(q);
  const userData = [];

  querySnap.forEach((doc) => {
    userData.push(doc.data());
  });
  return userData;
}

/**
 * Aysnchronous function to get all  posts from firestore backend.
 * @param {*} db
 * @returns {Array} array containing all posts
 */
export async function getAllPosts(db) {
  const collectionRef = collection(db, "users");
  const q = query(collectionRef, where("posts", "!=", null));
  const querySnap = await getDocs(q);
  let allPosts = [];
  querySnap.forEach((doc) => {
    if (doc.data().posts.length > 0) {
      doc.data().posts.forEach((post) => {
        allPosts.push(post);
      });
    }
  });

  return shuffleArray(allPosts);
}

/**
 * utility method to shufflr array
 * @param {*} array
 * @returns {Array} shuffled array
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
  }
  return array;
}

/**
 * Updates document in firestore backend based on the updateType
 * @param db
 * @param {string} username
 * @param {string} updateType
 * @param {Object} newData
 */
export async function updateDocument(db, username, updateType, newData) {
  const docRef = doc(db, "users", username); // for current user actions
  if (updateType === "post") {
    updateDoc(docRef, { posts: arrayUnion(newData) });
  } else if (updateType === "newlikedpost") {
    updateDoc(docRef, { likedPosts: arrayUnion(newData.id) });
  } else if (updateType === "removelikedpost") {
    updateDoc(docRef, { likedPosts: arrayRemove(newData.id) });
  } else if (updateType === "removesavedpost") {
    updateDoc(docRef, { savedPosts: arrayRemove(newData.id) });
  } else if (updateType === "newsavedpost") {
    updateDoc(docRef, { savedPosts: arrayUnion(newData.id) });
  } else if (updateType === "updatepost") {
    // docRef changes here as I am updating the post data of the user that owns the post, could be the currently logged in user or a different user
    const docRef = doc(db, "users", newData.username);
    const docSnap = await getDoc(docRef);
    let updatedPosts = docSnap.data().posts.map((post) => {
      if (post.id === newData.id) {
        return { ...newData };
      } else {
        return post;
      }
    });
    updateDoc(docRef, { posts: updatedPosts });
  } else if (updateType === "name") {
    updateDoc(docRef, { name: newData.name });
  } else {
    const docRef = doc(db, "users", newData.username);
    updateDoc(docRef, newData);
  }
}

/**
 * Method to encrypt user password
 * Allows for safe storage in the firestore backend
 * @param {*} plainPassword
 * @param {*} passwordGenerateKey
 * @returns
 */
export function encryptPassword(plainPassword, passwordGenerateKey) {
  return new Promise((resolve, reject) => {
    const algorithm = "aes-192-cbc";
    try {
      const key = scryptSync(passwordGenerateKey, "salt", 24);
      randomFill(new Uint8Array(16), (err, iv) => {
        if (err) {
          reject(err);
          return;
        }
        const cipher = createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(plainPassword, "utf8", "hex");
        encrypted += cipher.final("hex");
        let encryptedPasswordWithIV = iv.toString() + "+" + encrypted;
        resolve(encryptedPasswordWithIV);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Method to decrypt user password extracted from firestore backend
 * @param {*} encryptedPassword
 * @param {*} passwordGenerateKey
 * @returns
 */
export function decryptPassword(encryptedPassword, passwordGenerateKey) {
  try {
    const algorithm = "aes-192-cbc";
    // Use the async `crypto.scrypt()` instead.
    const key = scryptSync(passwordGenerateKey, "salt", 24);
    // Extract IV from password
    const ivBytes = encryptedPassword
      .split("+")[0]
      .split(",")
      .map((byte) => parseInt(byte));
    const iv = new Uint8Array(ivBytes);

    // //Extract password
    const encrypted = encryptedPassword.split("+")[1];

    const decipher = createDecipheriv(algorithm, key, iv);

    // Encrypted using same algorithm, key and iv.
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.log(error);
  }
}
