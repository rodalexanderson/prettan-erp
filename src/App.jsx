// App.js
import { useContext } from "react";
import "./App.css";
import { userContext } from "./context/userProvider";
import SignInEmail from "./Components/SignInEmail";
import HomePage from "./Pages/HomePage";

function App() {
  const user = useContext(userContext);
   return (!user ? <SignInEmail/> : <HomePage/>)
 };

export default App;

