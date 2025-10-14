import type React from "react";
import { useRef } from "react";

export function CoolAudioPlayer(props: {className: string | undefined, children: React.JSX.Element | string}){
    const audioPlayer = useRef(new Audio("/sounds/cat_1.wav"))
    return (
        <>
            <button className={props.className} onClick={() => {
               audioPlayer.current.currentTime = 0
               audioPlayer.current.play()
            }}>{props.children}</button>
            
        </>
    )
}