
import './App.css'
import { UpToolbar } from "./components/UpToolbar.tsx";
import { useEffect, useState } from "react";
import { GameWindow } from "./game/GameWindow.tsx";
import { DraggableObject } from "./components/funStuff/DraggableObject.tsx";
import { CoolAudioPlayer } from './components/funStuff/CoolAudioPlayer.tsx';
import { LanguageSystem, SoundSystem } from './GeneralStuff.ts';


function App() {
    const [websiteLoading, setIsWebsiteLoading] = useState(2)

    // seriously.
    const test: {[key: string]: string} = {}
    const [languageData, setLanguageData] = useState(test)

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
    }, []);
    if (window.innerWidth < 400 || window.innerHeight < 480)
    {
        return (
            <div className='flex flex-col'>
                <div className='text-white flex flex-col m-5 p-10 bg-black/30 rounded-xl'>
                    <img src='/niko_crying.jpg' className='max-w-20 justify-center self-center m-5'/>
                    <h1>{languageData["errorOhNo"]}</h1>
                </div>
                <div className='absolute bottom-0 w-full m-auto items-center flex flex-col origin-center bg-black text-white p-5'>
                    <h1 className='text-yellow-300 text-xl'>This website is a project of THEFIREY33.</h1>
                    <p>It is mainly made for fun, all rights of OneShot, belong to FutureCat LLC.</p>
                </div>
                <CoolAudioPlayer className="self-center bg-black text-white rounded-md p-4 border-2 cursor-pointer hover:bg-gray-800 focus:bg-gray-200">
                    {languageData["keepMeEntertained"]}
                </CoolAudioPlayer>
            </div>
        )
    }
    else
    {
    console.log("Website Load Phase, Thefirey33 'Load-Safe-Guard-System':", websiteLoading)
    // The game engine and the toolbar.
    return (
            <>
                
                {websiteLoading == 0 && <>
                    <GameWindow/>
                    <UpToolbar languageData={languageData}/>
                </>}
                {(window.innerWidth >= 810) && <>
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
}


export default App
