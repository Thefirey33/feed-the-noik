import { SoundSystem } from "./GeneralStuff"
import { GameEngineFunctions, ImageAsset, Vector2 } from "./GameEngineFunctions"


/**
 * This class contains all the face assets that the game might use.
 */
export class AllDialogueFaceAssets {
    public static NikoNeutral = new ImageAsset("/game_assets/dialogue_assets/niko/niko_neutral.png")
    public static NikoHappy = new ImageAsset("/game_assets/dialogue_assets/niko/niko_83c.png")
    public static NikoCry = new ImageAsset("/game_assets/dialogue_assets/niko/niko_cry.png")
    public static NikoPancakes = new ImageAsset("/game_assets/dialogue_assets/niko/niko_pancakes.png")
    public static NikoUpset = new ImageAsset("/game_assets/dialogue_assets/niko/niko_upset.png")
}
/**
 * The dialogue system.
 */
export class DialogSystem {
    /**
     * The margin/offset of the dialogue.
     */
    public static dialogMargin = 50
    /**
     * The size of the dialogue.
     */
    public static dialogueSize = 80
    /**
     * The font size of the dialog box.
     */
    public static fontSize = 20
    /**
     * The current char of the dialog box.
     */
    public static dialogCurrentChar = 0
    /**
     * The current dialog that's being displayed.
     */
    public static currentDialog: string = ""
    /**
     * The last text length that the last character represented.
     */
    public static lastTextLength = 0
    /**
     * How fast the dialogue will read each character accordingly.
     */
    public static howFastTheDialogueIs = 13

    /**
     * What face to render in the left of the dialogue box, could be Niko, could be anyone.
     */
    public static faceToRender : ImageAsset = AllDialogueFaceAssets.NikoNeutral

    public static onDialogueFinish : () => void
    /**
     * This function gets the dialogue system ready for the tasks.
     * @param dialogueToRender The dialogue that we should show on the screen.
     * @param faceToRender What character face to render on the left of the box.
     * @param onDialogueFinish When the dialogue is finished, please do this.
     */
    public static dialogueSetup(dialogueToRender: string, faceToRender: ImageAsset, onDialogueFinish: () => void)
    {
        this.currentDialog = dialogueToRender
        this.faceToRender = faceToRender
        this.dialogCurrentChar = 0
        this.onDialogueFinish = onDialogueFinish
    }
    /**
     * This function renders the dialog to the screen.
     * @param context The canvas context we have to use to get it to actually render on to the screen.
     * @param deltaTime The deltaTime number, used for general frame-match.
     */
    public static renderDialog(context: CanvasRenderingContext2D, deltaTime: number){
        if (this.currentDialog.length <= 0)
            return;
        const selfCanvas = context.canvas
        const yTopFirst = selfCanvas.height - this.dialogMargin * 2
        const dialogueBoxWidth = selfCanvas.width - this.dialogMargin * 2
        const currentSbstr = this.currentDialog.substring(0, this.dialogCurrentChar)
        // Draw the dialogue outline.
        const forLoopMax = 10.0
        for (let i = forLoopMax; i > 0; i--) {
            const baseCalc = (i / forLoopMax) * 255.0
            // unnecessary math.
            GameEngineFunctions.RenderRect(context, new Vector2(this.dialogMargin - i, yTopFirst - i), new Vector2(dialogueBoxWidth + i * 2, this.dialogueSize + i * 2), `rgba(${baseCalc}, ${baseCalc > 80 ? (baseCalc / (Math.sin(i) * 3)) : 0}, 6, 1)`)
        }
        // The background square.
        GameEngineFunctions.RenderRect(context, 
            new Vector2(this.dialogMargin, yTopFirst)
            , new Vector2(dialogueBoxWidth, 
            this.dialogueSize), "black"
        )
        // This renders the font to the screen.
        GameEngineFunctions.DrawFont(context, 
            new Vector2(this.dialogMargin * 1.5 + this.faceToRender.imgData.width, 
            ((yTopFirst + (this.dialogueSize / 1.8)))), 
            currentSbstr, 
            "white", 
            this.fontSize
        )
        GameEngineFunctions.RenderImage(context, 
            new Vector2(this.dialogMargin, yTopFirst - 10), 
            this.faceToRender
        )
        if (this.currentDialog.length > 0)
        {
            // Add the character index to the system.
            this.dialogCurrentChar += GameEngineFunctions.getActualDeltaTimeNumber(deltaTime) * this.howFastTheDialogueIs
            // Play the typewriter audio when a character is fired.
            // Only when there's no spaces.
            if ((this.lastTextLength != currentSbstr.length) && this.currentDialog.charAt(this.dialogCurrentChar) !== " ")
                SoundSystem.playAudio("text", false, true)
        }
        this.lastTextLength = currentSbstr.length
    }
}