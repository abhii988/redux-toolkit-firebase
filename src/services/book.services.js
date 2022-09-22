import { db } from "../firebase-config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  // orderBy,
  // query,
  // limit,
} from "firebase/firestore";

export const bookCollectionRef = collection(db, "books");
// export const bookCollectionRef = query(
//   collection(db, "books"),
//   orderBy("title", "desc"),
//   limit(1)
// );
// const documentSnapshots = getDocs(bookCollectionRef);
// const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
export const addBooks = (newBook) => {
  return addDoc(bookCollectionRef, newBook);
};

export const updateBook = (id, updatedBook) => {
  const bookDoc = doc(db, "books", id);
  return updateDoc(bookDoc, updatedBook);
};

export const deleteBook = (id) => {
  const bookDoc = doc(db, "books", id);
  return deleteDoc(bookDoc);
};

export const getAllBooks = () => {
  // console.log("last", lastVisible);
  return getDocs(bookCollectionRef);
};

export const getBook = (id) => {
  const bookDoc = doc(db, "books", id);
  return getDoc(bookDoc);
};
