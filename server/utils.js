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

export default async function checkDocumentExists(username, db) {
  const docRef = doc(db, "users", username);
  const docSnapShot = await getDoc(docRef);
  return docSnapShot.exists();
}

export async function getUserData(searchTerm, db) {
  const collectionRef = collection(db, "users");
  const q = query(collectionRef, where("email", "==", searchTerm));
  const querySnap = await getDocs(q);
  const userData = [];

  querySnap.forEach((doc) => {
    userData.push(doc.data());
  });
  return userData;
}

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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
  }
  return array;
}

export async function updateDocument(db, username, updateType, newData) {
  const docRef = doc(db, "users", username); // for current user actions
  if (updateType === "post") {
    updateDoc(docRef, { posts: arrayUnion(newData) });
  } 
  else if (updateType === "newlikedpost") {
    updateDoc(docRef, { likedPosts: arrayUnion(newData.id) });
  } 
  else if (updateType === "removelikedpost") {
    updateDoc(docRef, { likedPosts: arrayRemove(newData.id) });
  } 
  else if (updateType === "removesavedpost") {
    updateDoc(docRef, { savedPosts: arrayRemove(newData.id) });
  } 
  else if (updateType === "newsavedpost") {
    updateDoc(docRef, { savedPosts: arrayUnion(newData.id) });
  } 
  else if (updateType === "updatepost") {
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
  } 
  else if( updateType=== "name"){
    updateDoc(docRef, { name: newData.name });
  }
  else {
    const docRef = doc(db, "users", newData.username);
    updateDoc(docRef, newData);
  }
}
