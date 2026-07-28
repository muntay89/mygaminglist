import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Introbar(props){

  let {gameID} = useParams()
  const path = window.location.pathname
  const [route, setRoute] = useState('')
  const [intro, setIntro] = useState('')
  
  return(
    <div className="introbar">
            <p id="intro">{props.intro}</p>
    </div>
  )
}