import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavBar from "../../Components/NavBar/index"
import Dashboard from "../Dashboard"
import TicketPage from "../TicketPage"
import ProductPage from "../ProductPage"
import ProductHomePage from "../ProductHomePage"
import ClientPage from "../ClientPage"
import ClientHomePage from "../ClientHomePage"
import IncomePage from "../IncomePage"
import Admin from "../Admin"
import { useState, useEffect, useContext } from "react"
import { onSnapshot } from "firebase/firestore"
import { getCollectionRef } from "../../Services/CRUD"
import { userContext } from "../../context/userProvider"

const HomePage = () => {
  const user = useContext(userContext)
  const [usuario, setUsuario] = useState([])
  useEffect(() => {
    const unSubscribe = onSnapshot(getCollectionRef("users"), (data) => {
      setUsuario(
        data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const usuarioEncontrado = usuario.find(
    (usr) => usr.uid === user.uid && usr.email === user.email
  );
  
  const role = usuarioEncontrado ? usuarioEncontrado.role : null;
  return (

          <BrowserRouter>
            <NavBar/>
            <div className="w-full">
              <Routes>
                <Route path="/" element={<Dashboard role={role} />} />
                <Route path="/ticket" element={<TicketPage/>}/>
                <Route path="/ticket/:id" element={<TicketPage editMode={true}/>}/>
                <Route path="/income" element={<IncomePage/>}/>
                <Route path="/income/:id" element={<IncomePage editMode={true}/>}/>
                <Route path="/productsHomePage" element={<ProductHomePage role={role}/>}/>
                <Route path="/product" element={<ProductPage/>}/>
                <Route path="/product/:id" element={<ProductPage editMode={true}/>}/>
                <Route path="/clientHomePage" element={<ClientHomePage role={role}/>}/>
                <Route path="/client" element={<ClientPage/>}/>
                <Route path="/client/:id" element={<ClientPage editMode={true}/>}/>
                {role==='admin' &&
                  <Route path="/admin" element={<Admin role={role}/> }/>
                }
              </Routes>
            </div>
          </BrowserRouter>
          )
        }

export default HomePage
