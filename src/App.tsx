
import './App.css'
import { UpToolbar } from "./components/UpToolbar.tsx";
import { useEffect, useState } from "react";
import { GameWindow } from "./game/GameWindow.tsx";
import { DraggableObject } from "./components/funStuff/DraggableObject.tsx";
import { isMobileUser, LanguageSystem, SoundSystem } from './game/renderer/GeneralStuff.ts';


function App() {
    const [websiteLoading, setIsWebsiteLoading] = useState(2)
    const WINDOW_MARGIN = 10
    function getResolutionFromWindow(): {width: number, height: number} {
        return {
            width: window.innerWidth - WINDOW_MARGIN,
            height: window.innerHeight / 2
        }
    }
    const [gameResolution, setGameResolution] = useState(getResolutionFromWindow())
    const [languageData, setLanguageData] = useState({})
    const [fullscreenState, setFullscreenState] = useState(false)

    useEffect(() => {
        // This is the attacher that tells us when the assetloading is finished.
        document.addEventListener("load", () => {
            setIsWebsiteLoading(websiteLoading - 1)
        })
        // When the sound loader is finally finished, this function will kick in.
        SoundSystem.onLoadedAttach = () => {
            // After the final audio loading phase is done, set the global volume and the other stuff.
            setIsWebsiteLoading(0)
            SoundSystem.setGlobalVolume(0.2)
        }
        // Load all the sounds into the game registry.
        SoundSystem.LoadAllAudio()
        // Fetch the language data from the public resource.
        fetch("/lang.json").then(response => response.json()).then(data => {
            console.log("Loading all the language information to the game registry...")
            setLanguageData(data)
            // Set all the langauge data.
            LanguageSystem.SetAllLanguageData(data)
        })
        window.addEventListener("resize", () => {
            setGameResolution(getResolutionFromWindow())
        })
    }, [websiteLoading]);
    console.log("Website Load Phase, Thefirey33 'Load-Safe-Guard-System':", websiteLoading)
    // The game engine and the toolbar.
    return (
            <>
                
                {websiteLoading == 0 && <>
                    <UpToolbar languageData={languageData} getFullscreenState={fullscreenState} setFullscreenState={setFullscreenState}/>
                    <GameWindow width={gameResolution.width} height={gameResolution.height} isFullscreen={fullscreenState} setFullscreenDispatch={setFullscreenState}/>
                </>}
                {(window.innerWidth >= 810 && !(isMobileUser)) && <>
                    <DraggableObject imgSource={"noik-spin.gif"} alt={"noik!"}/>
                    <DraggableObject imgSource={"pancake.png"} alt={"noik!"}/>
                </>}
                {websiteLoading > 0 && <div style={{width: "100%", height: "100%", backgroundColor: "black", position: "absolute", top: "0%", left: "0%", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <h1 style={{fontSize: "35px"}}>mama is making pancakes, pls wait</h1>
                    <h1>Website by Thefirey33, Made in React!</h1>
                    {websiteLoading > 1 && <h1>Loading General Content...</h1>}
                    {websiteLoading > 0 && <h1>Loading All Audio...</h1>}
                </div>}
            </>
    )
}


export default App
