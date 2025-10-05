
import './App.css'
import {UpToolbar} from "./components/UpToolbar.tsx";
import {useEffect, useState} from "react";
import {GameWindow} from "./game/GameWindow.tsx";
import {DraggableObject} from "./components/funStuff/DraggableObject.tsx";


function App() {
    const [languageData, setLanguageData] = useState({})
    useEffect(() => {
        fetch("/lang.json").then(response => response.json()).then(data => {
            console.log("fetching website language content.")
            setLanguageData(data)
        })
    }, []);
    // The game engine and the toolbar.
    return (
        <>
            <UpToolbar languageData={languageData}/>
            <GameWindow/>
            <DraggableObject imgSource={"noik-spin.gif"} alt={"noik!"}/>
            <DraggableObject imgSource={"pancake.png"} alt={"noik!"}/>
        </>
    )
}


export default App
