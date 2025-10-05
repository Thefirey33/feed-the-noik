
export class SoundSystem {
    public playAudio(audioSrc: string){
        const audioElement = document.getElementById(audioSrc) as HTMLAudioElement
        audioElement.currentTime = 0;
        audioElement.play().then()
    }
}