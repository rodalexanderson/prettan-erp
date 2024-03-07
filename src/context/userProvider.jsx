import { createContext, useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { handleAuthChange } from "../Services/authChange";
import { getDocRef } from "../Services/CRUD";

export const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [unsubscribeUser, setUnsubscribeUser] = useState(null);

  useEffect(() => {
    let unsubscribeAuth = null;

    const subscribeToUser = (userData) => {
      if (unsubscribeUser) {
        unsubscribeUser();
      }
      const unsubscribe = onSnapshot(getDocRef("users", userData.uid), (data) => {
        setUser({ ...userData, ...data.data() });
      });
      setUnsubscribeUser(() => unsubscribe);
    };

    unsubscribeAuth = handleAuthChange((userData) => {
      if (userData) {
        subscribeToUser(userData);
      } else {
        setUser(null);
        if (unsubscribeUser) {
          unsubscribeUser();
        }
      }
    });

    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, []); // La dependencia del efecto ahora es un arreglo vacío para que se ejecute solo una vez

  return (
    <userContext.Provider value={user}>
      {children}
    </userContext.Provider>
  );
};





