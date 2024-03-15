import bodyParser from "body-parser";
import express from "express";
import { initializeApp } from "firebase/app";
import cors from "cors";
import "dotenv/config";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import checkDocumentExists, {
  getUserData,
  getAllPosts,
  updateDocument,
  encryptPassword,
  decryptPassword,
} from "./utils.js";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};
const app = express();
const firebaseApp = initializeApp(firebaseConfig);
const port = 3000;
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

function checkAuthorization(req, res, next) {
  if (!req.headers["authorization"]) {
    return res.status(401).json("Unauthorized");
  }
  next();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send(`<h1>Server Running.... </h1>`);
});

app.get("/user-data", checkAuthorization, async (req, res) => {
  if (
    auth.currentUser &&
    req.headers["authorization"].split(" ")[1] === auth.currentUser.accessToken
  ) {
    const userData = await getUserData(auth.currentUser.email, db);
    res.status(200).json({ userData: userData[0] });
  } else {
    res.status(401).json("Unauthorized");
  }
});

app.get("/all-posts", checkAuthorization, async (req, res) => {
  if (
    auth.currentUser &&
    req.headers["authorization"].split(" ")[1] === auth.currentUser.accessToken
  ) {
    const allPosts = await getAllPosts(db);
    res.status(200).json({ posts: allPosts });
  } else {
    res.status(401).json("Unauthorized");
  }
});

app.post("/sign-out", async (req, res) => {
  await signOut(auth).catch((error) => console.log(error));
  res.status(200).json("User logged out, session ended");
});

app.post("/signup", async (req, res) => {
  const { email, password, username, name } = req.body;
  if (await checkDocumentExists(username, db)) {
    res
      .status(409)
      .json({ message: "username is taken, please choose another" });
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const encryptedPassword = await encryptPassword(password, username);
    await setDoc(doc(db, "users", username), {
      email,
      username,
      password: encryptedPassword,
      name,
      posts: [],
      following: [],
      followers: [],
      likedPosts: [],
      savedPosts: [],
      archivedPosts: [],
    });
    res.status(201).json({
      message: "User created successfully",
      accessToken: user.accessToken,
    });
  } catch (error) {
    console.log(error);
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(400).json({ errorMessage, errorCode });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    res
      .status(200)
      .json({ message: "User Logged In", accessToken: user.accessToken });
  } catch (error) {
    console.log(error);
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(400).json({ errorMessage, errorCode });
  }
});

app.put("/update-document", checkAuthorization, async (req, res) => {
  const newData = req.body;
  const { updateType } = req.query;
  if (
    auth.currentUser &&
    req.headers["authorization"].split(" ")[1] === auth.currentUser.accessToken
  ) {
    const [{ username }] = await getUserData(auth.currentUser.email, db);
    try {
      updateDocument(db, username, updateType, newData);
      res.status(200).json("Updated Succesfully");
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.status(401).json("Unauthorized");
  }
});

app.post("/forgot-password", async (req, res) => {
  const { newpassword, email } = req.body;
  try {
    const userData = await getUserData(email, db);
    const password = decryptPassword(
      userData[0].password,
      userData[0].username
    );
    const user = await (
      await signInWithEmailAndPassword(auth, email, password)
    ).user;
    await updatePassword(user, newpassword);
    console.log(newpassword);
    const updatedEncryptedPassword = await encryptPassword(
      newpassword,
      userData[0].username
    );
    console.log(updatedEncryptedPassword);
    await updateDocument(db, userData[0].username, "", {
      username: userData[0].username,
      password: updatedEncryptedPassword,
    });
    res.status(200).json("Password changed");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port);
