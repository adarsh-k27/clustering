import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import storage, { db } from "../firebase-setup/setup";
import { addDoc, collection } from "firebase/firestore";

export const UploafileAction = async (file) => {
  const storageRef = ref(storage, `mapFile/${file.name}`);
  const metadata = {
    contentType: "application/xml",
  };
  // Change the path as needed
  const snapshot = await uploadBytes(storageRef, file, metadata);
  if (snapshot) {
    let url = await getDownloadURL(storageRef);
    debugger;
    return url;
  }

  //we need to upload to firebase
};

export const updateCollection = async (data) => {
  try {
    const collectionRef = collection(db, "heatmap");

    const addDocument = await addDoc(collectionRef, data);
  } catch (error) {
    console.error("my Firebase Error: ", error);
  }
};
