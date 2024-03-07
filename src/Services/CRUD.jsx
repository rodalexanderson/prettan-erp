import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

export const getDocRef = (col, id) => doc(db, col, id);
export const getCollectionRef = (col) => (collection(db, col));


// add data
export const addData = async (col, data) => {
  const collectionRef = getCollectionRef(col);
  const docRef = await addDoc(collectionRef, data);
  return docRef;
}

//update data
export const updateData = async (col, id, data) => {
  const docRef = getDocRef(col, id);
  await updateDoc(docRef, data);
};

//get data
export const getData = async (col) => {
  const collectionRef = getCollectionRef(col);
  const snapData = await getDocs(collectionRef);
  const data = snapData.docs.map((doc) => doc.data());
  return data;
};


//get Data by ID
export const getDataById = async (col, id) => {
  const docRef = getDocRef(col, id);
  const snapData = await getDoc(docRef);
  const data = snapData.data();
  return data;
};

//delete data
export const deleteData = async (col, id) => {
  const docRef = getDocRef(col, id);
  await deleteDoc(docRef);
};



/////////////////////////////////////////////////////////////////////////////////////////////////////




//set Document
export const setDocument = async (col, id, data) => {
  const docRef = getDocRef(col, id);
  const docSnapshot = await setDoc(docRef, data);
  return docSnapshot;
};

//subscribe to data
export const getSubscription = async (col, callback) => {
  const collectionRef = getCollectionRef(col);
  //const unsubscribe = onSnapshot(collectionRef, callback);
  const unsubscribe = await onSnapshot(collectionRef, callback);
  return unsubscribe;
};
