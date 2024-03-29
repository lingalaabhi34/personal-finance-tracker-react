import React, { useState } from "react";
import Input from "../components/Input/Input";
import signup from "./signup.module.css";
import Button from "../components/Button/Button";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore"; 

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signupWithEmail = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        createDoc(user);
        navigate("/dashboard");
        toast.success("User created successfully");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  const signupWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      createDoc(user);
      navigate("/dashboard");
      toast.success("User authenticated..!");
    
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      toast.error(errorMessage);
    });
  };

  const loginWithEmail = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        createDoc(user);
        navigate("/dashboard");
        toast.success("Logged In successfully");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      createDoc(user);
      console.log(user);
      navigate("/dashboard");
      toast.success("User authenticated..!");
      
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      toast.error(errorMessage);
    });
  };

  function createDoc(user) {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
  
    getDoc(userRef)
      .then((userData) => {
        if (!userData.exists()) {
          setDoc(userRef, {
            name: user.displayName || name,
            email: user.email,
            photoURL: user.photoURL || "",
            createdAt: new Date()
          })
            .then(() => {
              toast.success("Document created successfully");
            })
            .catch((error) => {
              console.error("Error creating document:", error);
              toast.error("Failed to create document");
            });
        } else {
          toast.warn("Document already exists");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("An error occurred while fetching user data");
      });
  }
  
  

  return (
    <div className={signup.signup}>
      {loading ? (
        <>
          <h1>Login Financely</h1>
          <form onSubmit={loginWithEmail}>
            <Input
              type="email"
              placeholder="Abhi@gmail.com"
              name="Email:"
              value={email}
              setstate={setEmail}
            />
            <Input
              type="password"
              placeholder="Password"
              name="Password:"
              value={password}
              setstate={setPassword}
            />
            <Button text="Login with Email" type="submit" onClick={loginWithEmail} />
          </form>
          <p>or</p>
          <Button text="Login with Google" onClick={loginWithGoogle} />
          <p onClick={() => setLoading(!loading)}>Don't Have An Account? Click Here</p>
        </>
      ) : (
        <>
          <h1>Sign Up On Financely</h1>
          <form onSubmit={signupWithEmail}>
            <Input
              type="text"
              placeholder="Abhi"
              name="Full name:"
              value={name}
              setstate={setName}
            />
            <Input
              type="email"
              placeholder="Abhi@gmail.com"
              name="Email:"
              value={email}
              setstate={setEmail}
            />
            <Input
              type="password"
              placeholder="Password"
              name="Password:"
              value={password}
             setstate={setPassword}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              name="Confirm Password:"
              value={confirmPassword}
              setstate={setConfirmPassword}
            />
            <Button text="Signup with Email" type="submit" onClick={signupWithEmail}/>
          </form>
          <p>or</p>
          <Button text="Signup with Google" onClick={signupWithGoogle} />
          <p onClick={() => setLoading(!loading)}>Have An Account? Click Here</p>
        </>
      )}
    </div>
  );
}
