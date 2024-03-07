import React from "react";
import {useState} from "react"
import { useNavigate } from "react-router-dom";
import SignOut from "../SignOutEmail"
import Menu from "../../multimedia/png/menu.png"
const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate()
  return (
    <>
      <nav className="sticky top-0 flex  flex-wrap items-center justify-between py-2 bg-yellow-500 text-black ">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <button
              className="decoration-amber-900 cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
                <img src={Menu} alt="menu icon" className="h-10" />
            </button>
          </div>
          <div
            className={
              "lg:flex lg:flex-row lg:my-2 flex-grow justify-around items-center" +
              (navbarOpen ? " flex flex-col" : " hidden")
            }
            
          >
            <button className="text-black text-lg my-2 lg:my-0 lg:text-xl hover:text-black hover:font-bold" onClick={() => navigate('/')}> Inicio </button>
            <button className="text-black text-lg my-2 lg:my-0 lg:text-xl hover:text-black hover:font-bold" onClick={() => navigate('/productsHomePage')}> Productos </button>
            <button className="text-black text-lg my-2 lg:my-0 lg:text-xl hover:text-black hover:font-bold" onClick={() => navigate('/clientHomePage')}> Clientes </button>
            <SignOut/>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar