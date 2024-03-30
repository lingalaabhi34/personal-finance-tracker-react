import React, { useEffect } from 'react'
import header from "./header.module.css"
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
export default function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate()
  useEffect(()=>{
if(user){
navigate("/dashboard");
}
  },[user,loading]);

  const logoutfn=()=>{
try{
  signOut(auth).then(() => {
    // Sign-out successful.
    navigate("/");
    toast.success("Logout successfully");
  }).catch((error) => {
    // An error happened.
    toast.error(error);
  });
  
}
catch(e){
  console.log(e.message);
}    
  }

  return (
    <div className={header.btn}>
      <h2>Financly.</h2>
   
      <h2 onClick={logoutfn}>Logout</h2>
    </div>
  )
}
