import React from 'react'
import input from "./input.module.css"
export default function Input({type,placeholer,name,state,setstate}) {
  return (
    <div className={input.field}>
        <label>{name}</label>
      <input type={type} placeholder={placeholer}  value={state} onChange={(e)=>setstate(e.target.value)}/>
    </div>
  )
}
