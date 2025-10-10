
export class SoundSystem {
    public playAudio(audioSrc: string){
        const audioElement = document.getElementById(audioSrc) as HTMLAudioElement
        audioElement.currentTime = 0;
        audioElement.play().then()
    }
    /**
     * Set the volume number.
     * @param volSpecified Vol Percentage.
     */
    public setVolume(volSpecified: number){
        const audioList = document.querySelectorAll("audio") as NodeListOf<HTMLAudioElement>
        audioList.forEach((value) => {
            value.volume = volSpecified
        })
    }
}