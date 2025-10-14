import {SoundSystem} from "../GeneralStuff.ts";


export function MessageBox(props: {topHeader: string, whenClosed: () => void, languageData: {[key: string]: string}}) {

    if (props.topHeader === "")
        return <></>
    return <>
            <div className="z-20 fixed w-full h-full bg-black/30 rounded-xl flex justify-center items-center">
                <div className="border-2 p-4 border-white ml-auto text-white items-center grid grid-rows-2 mr-auto message-box-scaling rounded-md max-w-fit max-h-fit bg-black">
                    {props.topHeader.split("\n").map((value, index) => {
                        return <h1 className="text-xl" key={index}>{value}</h1>
                    })}
                    <button
                        className="text-black mt-5 bg-yellow-300 ml-auto mr-auto p-3 w-fit rounded-xl h-fit hover:scale-120 transition-all duration-75 focus:bg-yellow-50 cursor-pointer"
                        onMouseEnter={() => {
                            SoundSystem.playAudio("cursor");
                        }}
                        onClick={() => {
                            // Set Message Box state, back to nothing.
                            SoundSystem.playAudio("cancel");
                            props.whenClosed()
                        }}>{props.languageData["ok"]}
                    </button>
                </div>
            </div>
        </>;
}