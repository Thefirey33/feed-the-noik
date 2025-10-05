/**
 * The Vector2, Two-Axis Position System.
 */
export class Vector2{
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    addition(other: Vector2)
    {
        return new Vector2(this.x + other.x, this.y + other.y)
    }
}
export const AMOUNT_OF_IMAGES_LEFT: string[] = []
export const GLOBAL_FONT = "TerminusTTF"

/**
 * Base class for Images, or Textures.
 */
export class ImageAsset {
    imgData: HTMLImageElement
    constructor(imgSource: string) {
        const img = new Image()
        img.src = imgSource
        this.imgData = img
        AMOUNT_OF_IMAGES_LEFT.push(imgSource)
        this.imgData.onload = () => {
            AMOUNT_OF_IMAGES_LEFT.splice(AMOUNT_OF_IMAGES_LEFT.indexOf(imgSource), 1)
        }
    }
    public render(canvasContext: CanvasRenderingContext2D, position: Vector2){
        GameEngineFunctions.RenderImage(canvasContext, position, this)
    }
}

/**
 * The Animated Image Asset system, used for animated stuff.
 */
export class AnimatedImageAsset {
    imgArray: ImageAsset[] = []
    aniFrame: number
    constructor(imgArray: string[]) {
        imgArray.forEach(value => {
            this.imgArray.push(new ImageAsset(value))
        })
        this.aniFrame = 0
    }
    public render(canvasContext: CanvasRenderingContext2D, position: Vector2, deltaTime: number, isAnimating: boolean = true, tilemapAniSpeed: number = 20){
        const currentFrame = Math.floor(this.aniFrame)
        GameEngineFunctions.RenderImage(canvasContext, position, this.imgArray[currentFrame])
        if (KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyD"))
        {
            GameEngineFunctions.DrawFont(canvasContext, position, `F${currentFrame}`, "white", 20)
        }
        if (isAnimating)
            this.aniFrame = (this.aniFrame + deltaTime * tilemapAniSpeed) % this.imgArray.length;
    }
}

/**
 * The keyboard input handler that handles input, and other stuff.
 */
export class KeyboardInputHandler {
    currentPressedKeyCollection: string[] = []
    public static instance: KeyboardInputHandler
    /**
     * The keyboard input handler constructor, to use for the game that we're making right now.
     */
    constructor() {
        KeyboardInputHandler.instance = this;
        document.addEventListener("keydown", (keyEvent) => {
            const keyCodeCurrent = keyEvent.code;
            if (this.currentPressedKeyCollection.indexOf(keyCodeCurrent) === -1)
            {
                // Add this to the key-pressed collection.
                this.currentPressedKeyCollection.push(keyCodeCurrent);
            }
        })
        document.addEventListener("keyup", (keyEvent) => {
            const keyCodeReleased = keyEvent.code;
            if (this.currentPressedKeyCollection.indexOf(keyCodeReleased) !== -1)
            {
                // Delete the keycode from the array, so we can continue capturing.
                this.currentPressedKeyCollection.splice(this.currentPressedKeyCollection.indexOf(keyCodeReleased), 1);
            }
        })
    }

    /**
     * Check if a key has been pressed recently.
     * @param keycode The keycode to check for.
     */
    public checkIfKeyIsPressed(keycode: string)
    {
        return (this.currentPressedKeyCollection.indexOf(keycode) !== -1)
    }
}
export function drawDebugText(context: CanvasRenderingContext2D, deltaTime: number){
    GameEngineFunctions.DrawFont(context, new Vector2(0, 20), `Tendrillion Debug: ${deltaTime}ms frame time`, "white", 20)
}
/**
 * Base GameEngineFunctions, filled with rendering functions.
 */
export class GameEngineFunctions {
    /**
     * This function clears the canvas.
     * @param canvasContext The CanvasContext used for the screen, or the screen context.
     * @constructor
     */
    public static ClearCanvas(canvasContext: CanvasRenderingContext2D){
        canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    }

    /**
     * This function renders a rectangle to the screen.
     * @param canvasContext The canvas context, or the screen to render it to.
     * @param position The Vector2 position for the rectangle to be drawn from. (Top-Left corner.)
     * @param size The size of the rectangle.
     * @param color The color of the rectangle. (#000000 color system.)
     * @constructor
     */
    public static RenderRect(canvasContext: CanvasRenderingContext2D, position: Vector2, size: Vector2, color: string){
        canvasContext.fillStyle = color;
        canvasContext.fillRect(position.x, position.y, size.x, size.y);
    }

    /**
     * This initializes a text system to be ready.
     * @param canvasContext The canvas context, or screen for the text to be initialized to.
     * @param color The color of the text to be initialized.
     * @param size The size of the text to be initialized.
     * @constructor
     */
    public static TextInitialization(canvasContext: CanvasRenderingContext2D, color: string, size: number){
        canvasContext.fillStyle = color;
        canvasContext.font = `${size}px ${GLOBAL_FONT}`;
    }

    /**
     * This function draws a string to the screen.
     * @param canvasContext The canvas context, or screen to the draw to.
     * @param position The position of the text to be located. (Left-Alignment.)
     * @param text The actual text we want to render.
     * @param color The color of the text we want to render.
     * @param size The size of the text we want to render.
     * @constructor
     */
    public static DrawFont(canvasContext: CanvasRenderingContext2D, position: Vector2, text: string, color: string, size: number): TextMetrics {
        // This initializes the text functions, then we render.
        GameEngineFunctions.TextInitialization(canvasContext, color, size)
        // Render the font to the screen.
        canvasContext.fillText(text, position.x, position.y);
        return canvasContext.measureText(text)
    }

    /**
     * This function renders an image to the screen.
     * @param canvasContext The canvas context, or screen to render to.
     * @param position The position of the image we want to render.
     * @param image The image we actually want to render to the screen.
     * @constructor
     */
    public static RenderImage(canvasContext: CanvasRenderingContext2D, position: Vector2, image: ImageAsset){
        canvasContext.drawImage(image.imgData, position.x, position.y)
    }

    public static getActualDeltaTimeNumber(rawDeltaTime: number): number {
        return rawDeltaTime / 1000;
    }
}