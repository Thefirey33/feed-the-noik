import "../App.css"
import * as React from "react";
import {SoundSystem} from "../game/renderer/GeneralStuff.ts";
import { MessageBox } from "./MessageBox.tsx";
import {useRef} from "react";

export function UpToolbar(props: {languageData: { [key: string]: string}, getFullscreenState: boolean, setFullscreenState: React.Dispatch<React.SetStateAction<boolean>>}) {
    function ToolbarButton (props: {onClick?: () => void, children: React.JSX.Element | string}) {
        return (
            <>
                <button className="bg-yellow-300 rounded-xl p-2 m-2 min-w-10 hover:scale-120 cursor-pointer transition-all duration-75 focus:bg-yellow-50" onMouseEnter={() =>
                    {
                        SoundSystem.playAudio("cursor");
                    }
                } onClick={() => {
                    SoundSystem.playAudio("decision");
                    props.onClick?.();
                }}>
                    <h1 className="text-black font-scaling">{props.children}</h1>
                </button>
            </>
        )
    }
    const countOfTimesYouDecidedToMeow = useRef(1)
    const [messageBoxText, setMessageBoxText] = React.useState("")
    return (
        <span className={"z-30"}>
            <div key={0} className="p-3 m-2 bg-black text-white text-xl border-2 rounded-xl border-yellow-300">

                <div className="flex flex-row items-center">
                    <img src="/niko_pancake.jpg" alt="the noik." className="mr-5" width={50}/>
                    <h1 className="text-xl font-scaling transition-all">Feed The Noik</h1>
                    <div className="ml-3">
                        <ToolbarButton onClick={() => {
                            window.location.href = "https://thefirey33.vercel.app/"
                        }}>{
                            props.languageData["backToThefirey33"]
                        }</ToolbarButton>
                        <ToolbarButton onClick={() => {
                            setMessageBoxText(props.languageData["noikDemand"])
                        }}>{
                            props.languageData["instruction"]
                        }</ToolbarButton>
                        <ToolbarButton onClick={() => {
                            setMessageBoxText(props.languageData["creditsButton"])
                        }}>{
                            props.languageData["credits"]
                        }</ToolbarButton>
                        <ToolbarButton onClick={() => {
                            setTimeout(() => {
                                SoundSystem.playAudio("cat_1")
                                setMessageBoxText((props.languageData["meowText"] + "\n").repeat(countOfTimesYouDecidedToMeow.current))
                                countOfTimesYouDecidedToMeow.current++
                            }, 1000)
                        }}>{
                            props.languageData["funnyButton"]
                        }</ToolbarButton>
                        <ToolbarButton onClick={() => {
                            props.setFullscreenState(!props.getFullscreenState)
                            
                        }}>{props.languageData["fullscreen"]}
                        </ToolbarButton>
                    </div>
                </div>
            </div>
            <MessageBox topHeader={messageBoxText} whenClosed={() => {
                setMessageBoxText("")
            }} languageData={props.languageData}/>
        </span>
    );
}