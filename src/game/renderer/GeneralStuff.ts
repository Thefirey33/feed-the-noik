import { Vector2 } from "./GameEngineFunctions"

class BlobContainer {
    blobItself: Blob
    blobUrl: string
    audioSource: HTMLAudioElement
    constructor(blobItself: Blob) {
        this.blobItself = blobItself
        this.blobUrl = URL.createObjectURL(this.blobItself)
        this.audioSource = new Audio(this.blobUrl)
    }
}
export class LanguageSystem {
    public static LanguageData : {[key: string]: string} = {}
    public static SetAllLanguageData(languageData: ({[key: string]: string})){
        LanguageSystem.LanguageData = languageData
    }
    public static getLanguageData(keyName: string){
        return LanguageSystem.LanguageData[keyName]
    }
}
// If the player is a mobile user, add mobile specific functions.

/**
 * The User Agent RegEx, responsible for checking if the user has a mobile device. 
 */
const userAgentRegExTest = /Android|Macintosh|iPad|iPhone/g
/**
 * If the user is a mobile user, this flag will be set to true.
 */
export const isMobileUser = userAgentRegExTest.test(window.navigator.userAgent)

/**
 * The virtual mouse cursor that basically shows the current position of the virtual mouse cursor,
 * meant for mobile devices.
 */
export const virtualMouseCursor : Vector2[] = []

export class SoundSystem {
    public static Sounds : Map<string, BlobContainer> = new Map<string, BlobContainer>();

    public static async LoadAsBlob(soundID: string): Promise<Blob | undefined> {
        let response = undefined
        await fetch(soundID, {})
        .then(r => r.blob())
        .then(r => {
            response = r
        })
        .catch(() => {
            alert("A Sound file couldn't be loaded!")
        })
        return response
    }
    /**
     * This is a wrapper function which wraps the loading through checking and protection.
     * @param audioID 
     * @param audioName 
     */
    public static async LoadAudioThroughBlob(audioID: string, audioName: string){
        const loadedAudio = await this.LoadAsBlob(audioID)
        if (loadedAudio != undefined)
        {
            console.log("Loaded: ", audioName)
            this.Sounds.set(audioName, new BlobContainer(loadedAudio))
            this.currentLoadingAssets--
            if (this.currentLoadingAssets <= 0)
                SoundSystem.onLoadedAttach()
        }
        else{
            console.error("Failed to load: ", audioName)
            if (!confirm("There was an error loading some content, do you want to PROCEED further into the website?"))
            {
                window.location.href = "about:blank"
            }
        }
    }
    public static onLoadedAttach : () => void
    public static currentLoadingAssets = 0
    /**
     * This function loads all the audio files to the game registry.
     * So we can use it in-gameplay.
     */
    public static async LoadAllAudio(){
        /*
            The Old Audio System looked like this.
            Kinda SHIT, right?

            HMM?
            <audio src={"/sounds/menu_buzzer.wav"} id={"buzzer"}/>
            <audio src={"/sounds/menu_cancel.wav"} id={"cancel"}/>
            <audio src={"/sounds/menu_decision.wav"} id={"decision"}/>
            <audio src={"/sounds/cat_1.wav"} id={"cat_1"}/>
            <audio src={"/sounds/game/LibraryStroll.ogg"} id='bgm'/>*/

        // After we are done, fetching the json information for the audio sources,
        // Fetch even more data...
        await fetch("/sounds/audio_source_information.json")
        .then(r => r.json())
        .then(r => {
            r.forEach((element: {"id": string, "name": string}) => {
                console.log("Loading:", element)
                this.currentLoadingAssets ++
                this.LoadAudioThroughBlob(element.id, element.name)
            });
        })
    }
    /**
     * This function plays an audio file, through the fetched blob content.
     * @param audioSrc The audio source to play.
     * @param [looping=false] If the audio should loop or not.
     */
    public static playAudio(audioSrc: string, looping: boolean = false, notPlayIfPlaying = false){
        if (SoundSystem.Sounds.has(audioSrc)){
            const recievedBlob = SoundSystem.Sounds.get(audioSrc)
            if (recievedBlob != undefined)
            {
                const source = recievedBlob.audioSource
                // Play the already loaded sound file, please.
                source.currentTime = 0
                source.play()
                if (looping)
                {
                    if (notPlayIfPlaying && !(source.currentTime != 0))
                        return;
                    source.addEventListener("ended", () => {
                        source.currentTime = 0
                        source.play()
                    })
                }
            }
        }
    }
    /**
     * Set the volume number.
     * @param volSpecified Vol Percentage.
     */
    public static setGlobalVolume(volSpecified: number){
        // Go through all of the sound files, set the one that's specified.
        SoundSystem.Sounds.forEach((soundElement) => {
            soundElement.audioSource.volume = volSpecified
        })
    }
}