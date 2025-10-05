
import './App.css'
import {UpToolbar} from "./components/UpToolbar.tsx";
import {useEffect, useState} from "react";
import {GameWindow} from "./game/GameWindow.tsx";
import {DraggableObject} from "./components/funStuff/DraggableObject.tsx";

function App() {
    const [websiteLoading, setIsWebsiteLoading] = useState(true)
    window.addEventListener("load", () => {
        setIsWebsiteLoading(false)
    })
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
            {websiteLoading && <div style={{width: "100%", height: "100%", backgroundColor: "black", position: "absolute", top: "0%", left: "0%", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <h1 style={{fontSize: "35px"}}>mama is making pancakes, pls wait</h1>
                <h1>Website by Thefirey33, Made in React!</h1>
            </div>}

            <div className={"hidden"}>
                <audio src={"/sounds/menu_cursor.wav"} id={"cursor"}/>
                <audio src={"/sounds/menu_buzzer.wav"} id={"buzzer"}/>
                <audio src={"/sounds/menu_cancel.wav"} id={"cancel"}/>
                <audio src={"/sounds/menu_decision.wav"} id={"decision"}/>
                <audio src={"/sounds/cat_1.wav"} id={"cat_1"}/>
            </div>
        </>
    )
}


export default App
