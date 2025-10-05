
export class SoundSystem {
    selectAudio : HTMLAudioElement;
    clickAudio : HTMLAudioElement;
    cancelAudio : HTMLAudioElement;
    cat_1: HTMLAudioElement
    constructor() {
        this.selectAudio = new Audio("/sounds/menu_cursor.wav")
        this.clickAudio = new Audio("/sounds/menu_decision.wav")
        this.cancelAudio = new Audio("/sounds/menu_cancel.wav")
        this.cat_1 = new Audio("/sounds/cat_1.wav")
    }
    public playAudio(audioElement: HTMLAudioElement){
        audioElement.currentTime = 0;
        audioElement.play().then();
    }
}