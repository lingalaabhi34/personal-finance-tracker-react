import React, { useEffect } from "react";
import header from "./header.module.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
// import userimg from "../../Assests/user-svgrepo-com.svg";
import userimg from "../../Assests/user-svgrepo-com.svg";
export default function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  console.log(user);
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  const logoutfn = () => {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          navigate("/");
          toast.success("Logout successfully");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error);
        });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className={header.btn}>
      <h1>Financly.</h1>
      <div className={header.photo}>
        {user ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <img src={user.photoURL || userimg} alt="User" />
            <h3 onClick={logoutfn}>Logout</h3>
          </div>
        ) : (
          <div>
            <img src={userimg} alt="User" />
          </div>
        )}
      </div>
    </div>
  );
}
