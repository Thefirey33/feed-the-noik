
import './App.css'
import {UpToolbar} from "./components/UpToolbar.tsx";
import {useEffect, useState} from "react";
import {GameWindow} from "./game/GameWindow.tsx";
import {DraggableObject} from "./components/funStuff/DraggableObject.tsx";


function App() {
    const [websiteLoading, setIsWebsiteLoading] = useState(true)
    //const userAgentRegExTest = /Android|Macintosh|iPad|iPhone/g
    //const isMobileUser = userAgentRegExTest.test(window.navigator.userAgent)
    window.addEventListener("load", () => {
        // Extra 500ms delay to prevent slow loading.
        setTimeout(() => {
            setIsWebsiteLoading(false)
        }, 500)
    })
    const [languageData, setLanguageData] = useState({})
    useEffect(() => {
        fetch("/lang.json").then(response => response.json()).then(data => {
            console.log("fetching website language content.")
            setLanguageData(data)
        })
    }, []);
    if (window.innerWidth < 655 || window.innerHeight < 480)
    {
        return (
            <>
                <div className='text-white flex flex-col m-5 p-10 bg-black/30 rounded-xl'>
                    <img src='/niko_crying.jpg' className='max-w-20 justify-center self-center m-5'/>
                    <h1>Your display is too small for the game to played well-enough, i'm really sorry.</h1>
                </div>
                <div className='absolute bottom-0 justify-items-center items-center flex flex-col w-full min-h-10 bg-black rounded-md text-white p-5'>
                    <h1 className='text-white font-bold'>This website is a project of THEFIREY33.</h1>
                    <p>It is mainly made for fun, all rights of OneShot, belong to FutureCat LLC.</p>
                </div>
            </>
        )
    }
    else
    {
    // The game engine and the toolbar.
    return (
            <>
                <UpToolbar languageData={languageData}/>
                <GameWindow/>
                {(window.innerWidth >= 810) && <DraggableObject imgSource={"noik-spin.gif"} alt={"noik!"}/>}
                {(window.innerWidth >= 810) && <DraggableObject imgSource={"pancake.png"} alt={"noik!"}/>}
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
                    <audio src={"/sounds/game/LibraryStroll.ogg"} id='bgm'/>
                </div>
            </>
        )
    }
}


export default App
