import React from "react";
import button from "./button.module.css"
const Button=({text,onClick})=>{
    return(<>
    <button onClick={onClick} >{text}</button>
    </>)
}
export default Button