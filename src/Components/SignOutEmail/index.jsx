import Logout from "../../multimedia/png/logout.png"
import { signOut } from "firebase/auth"
import { auth } from "../../Services/firebase"


const SignOut = () => {
    const logOut = () => {
        signOut(auth)
    }
    return( <div className="flex flew-row justify-bewteen my-2 lg:my-0">
                
                <button className="flex" onClick={logOut}>
                    <p className="text-black text-lg lg:my-0 lg:text-xl hover:text-black hover:font-bold pt-2 mr-2">Salir</p> 
                    <img src={Logout} alt="log out logo" width={44} height={30}/>
                </button>
                
            </div>

    )
}

export default SignOut