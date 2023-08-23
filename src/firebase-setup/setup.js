import { initializeApp } from "firebase/app";

import {
  getFirestore,
  addDoc,
  collection,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
  query,
  limit,
} from "firebase/firestore";
// import { getStorage } from "firebase/storage";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCsUfOGcSxf1WfRCVxgCc-MQLJdi26Kzf0",
    authDomain: "heat-map-95b3b.firebaseapp.com",
    projectId: "heat-map-95b3b",
    storageBucket: "heat-map-95b3b.appspot.com",
    messagingSenderId: "813471291947",
    appId: "1:813471291947:web:e15c0d1a9d9d1d70ee686e"
  };

export const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);

export const db = getFirestore(app);
export const auth = getAuth(app);


export const getAllDocuments = async (collectionName) => {
  const res = await getDocs(collection(db, collectionName));
  const modifyResponce = [];
  res.docs.forEach((e) => modifyResponce.push({ id: e.id, ...e.data() }));
  return modifyResponce;
};

export const addDocument = (data, collectionName) =>
  addDoc(collection(db, collectionName), data);

export const deleteDocument = async (collectionName, id) =>
  await deleteDoc(doc(db, collectionName, id));

export const updateDocument = async (
  updateUser,
  collectionName,
  docId
) => {
  try {
    const docRef = doc(collection(db, collectionName), docId);
    await updateDoc(docRef, updateUser);
  } catch (err) {
    console.log(err);
  }
};
const storage = getStorage(app);

export default storage;

export const GetQueryData = async (
  collectionName,
  _q
) => {
  try {
    const CollectionRef = collection(db, collectionName);
    const _query = query(CollectionRef, _q,limit(5));

    let res = await getDocs(_query);

    let data = res.docs.map((data) => {
      let id = data.id;
      return { id, ...data.data() };
    });
    return data;
  } catch (error) {}
};

// export const GetQueryData=(collectionRef,query)=>{
//   try {

//   } catch (error) {

//   }
// }

//
