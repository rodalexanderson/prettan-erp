import { useState } from "react"
import {auth} from "../../Services/firebase" 
import {signInWithEmailAndPassword } from "firebase/auth"

export default function SignInEmail() {
    
    const [data, setData] = useState({
        email:'',
        password:''
    })

    const handleInput = (event) => {
        let newInput = {[event.target.name]: event.target.value}
        setData({...data, ...newInput})
    }
    
    const handleSubmit = () => {
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then ((response) => {
            console.log(response.user)
        })
        .catch((err) => {
            alert(err.message)
        })
    }
    
    return(
        <div className="flex flex-col mt-16 md:flex-row md:my-32 bg-grey-100 mx-auto justify-center">
        <div className="flex flex-col items-center justify-center w-full md:w-3/5 mx-auto">
            <img src="logo-prettan.png" alt="logo de prettan" width={300} className="mb-8" />
            <h1 className=" text-center text-xl font-bold">Admin Panel de PRETTAN</h1>
        </div>
        <div className="md:py-32 mx-auto text-center block px-6 rounded-lg shadow-lg bg-white w-3/5 lg:w-1/2 xl:w-1/3 md:px-16 md:mx-16 py-4 my-16">
            <div className="flex flex-col mb-8">
                <div className="flex flex-col mb-6">
                    <input 
                    type="email" 
                    name="email"
                    placeholder="Ingresa tu correo"
                    onChange={(event) => handleInput(event)}
                    className="w-full border-2 border-solid border-yellow-500 rounded-md"
                    id="email"
                    />
                    <label className="text-sm"> Correo Electrónico</label>
                </div>
                <div className="flex flex-col">
                    <input 
                    type="password" 
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    onChange={(event) => handleInput(event)}
                    className="w-full border-2 border-solid border-yellow-500 rounded-md"
                    id="password"
                    />
                    <label className="text-sm"> Contraseña</label>
                </div>
            </div>
            <button  onClick={(event) => handleSubmit(event)} className="bg-black border-yellow-500 border-2 rounded-lg hover:bg-yellow-700 hover:text-black text-yellow-500 font-bold py-2 px-8">
                Ingresar
            </button>
        </div>
        </div>
    )

}