


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
    public render(canvasContext: CanvasRenderingContext2D, position: Vector2, deltaTime: number, isAnimating: boolean = true, aniSpeed: number = 20, alignmentCenter = false){
        const currentFrame = Math.floor(this.aniFrame)
        let newPosition = position
        const currentImg = this.imgArray[currentFrame]
        if (alignmentCenter)
        {
            // Change the new position value, so the image is centered.
            const imgData = currentImg.imgData
            newPosition = position.addition(new Vector2(imgData.width / 2, imgData.height / 2))
        }
        // Draw the image.
        GameEngineFunctions.RenderImage(canvasContext, newPosition, currentImg)
        if (KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyQ"))
        {
            GameEngineFunctions.DrawFont(canvasContext, position, `F${currentFrame}`, "white", 20)
        }
        if (isAnimating)
            this.aniFrame = (this.aniFrame + deltaTime * aniSpeed) % this.imgArray.length;
        else
            this.aniFrame = 0
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

export class Entity {
    /**
     * This must contain a IDLE animation. Specified as the "idle" identifier.
     */
    textures: Map<string, AnimatedImageAsset>
    position: Vector2
    idleAnimationKey = "idle"
    constructor(textures: Map<string, AnimatedImageAsset>, position: Vector2)
    {
        this.textures = textures
        this.position = position
    }

    /**
     * This renders the entity to the screen.
     */
    public render_this_object(canvas: CanvasRenderingContext2D, deltaTime: number, cameraPosition: Vector2) {
        if (this.textures.has(this.idleAnimationKey))
        {
            const animatedImageKey = this.textures.get(this.idleAnimationKey)
            animatedImageKey?.render(canvas, this.position.addition(cameraPosition), deltaTime, true, 1, true)
        }
    }
}
/**
 * The facing values that we are probably 100% going to use.
 */
export class Facing {
    public static FORWARD: string = "forward"
    public static LEFT: string = "left"
    public static RIGHT: string = "right"
    public static BACK: string = "back"
}
/**
 * Noik, who is who we help, for them to stay satiated etc.
 */
export class NikoEntity extends Entity {
    /**
     * What is the Noik currently facing towards?
     */
    currentlyFacing = "forward"
    constructor(position: Vector2)
    {
        const imgs = new Map<string, AnimatedImageAsset>();
        
        // Texture definitions.

        // Sprites for the Noik facing forward towards the camera.
        const forwardSprites = new AnimatedImageAsset(
            ["/game_assets/sprites/niko/forward/forward0.png", 
            "/game_assets/sprites/niko/forward/forward1.png", 
            "/game_assets/sprites/niko/forward/forward2.png", 
            "/game_assets/sprites/niko/forward/forward3.png"
        ])
        // Sprites for the Noik facing left.
        const leftSprites = new AnimatedImageAsset([
            "/game_assets/sprites/niko/left/left0.png", 
            "/game_assets/sprites/niko/left/left1.png", 
            "/game_assets/sprites/niko/left/left2.png", 
            "/game_assets/sprites/niko/left/left3.png"
        ])
        // Sprites for the Noik facing right.
        const rightSprites = new AnimatedImageAsset([
            "/game_assets/sprites/niko/right/right0.png", 
            "/game_assets/sprites/niko/right/right1.png", 
            "/game_assets/sprites/niko/right/right2.png", 
            "/game_assets/sprites/niko/right/right3.png"
        ])
        // Sprites for the Noik facing forward, but not towards the camera.
        const backSprites = new AnimatedImageAsset([
            "/game_assets/sprites/niko/back/back0.png", 
            "/game_assets/sprites/niko/back/back1.png", 
            "/game_assets/sprites/niko/back/back2.png", 
            "/game_assets/sprites/niko/back/back3.png"
        ])

        // Add the now registered textures to the map.
        imgs.set("forward", forwardSprites)
        imgs.set("right", rightSprites)
        imgs.set("left", leftSprites)
        imgs.set("back", backSprites)
        // forward sprite locations.
        super(imgs,
        position)
    }
    public render_this_object(canvas: CanvasRenderingContext2D, deltaTime: number, cameraPosition: Vector2): void {
        const currentFrame = this.textures.get(this.currentlyFacing)
        if (currentFrame !== undefined)
        {
            const textureDat = currentFrame.imgArray[0].imgData
            const cameraAdjustedPosition = this.position.addition(cameraPosition)
            // Draw the shadow circle.
            GameEngineFunctions.DrawCircle(canvas, "rgba(0, 0, 0, 0.5)", cameraAdjustedPosition.addition(new Vector2(textureDat?.width, textureDat?.height * 1.5)), new Vector2(20, 5))
            currentFrame.render(canvas, cameraAdjustedPosition, deltaTime, true, 0.005, true)
            this.position = new Vector2(this.position.x, this.position.y + (GameEngineFunctions.getActualDeltaTimeNumber(deltaTime)) * 100)
            console.log(this.position)
        }
    }
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
        canvasContext.beginPath()
        canvasContext.fillStyle = color;
        canvasContext.fillRect(position.x, position.y, size.x, size.y);
        canvasContext.closePath()
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
    public static DrawCircle(canvasContext: CanvasRenderingContext2D, color: string, position: Vector2, radius: Vector2){
        canvasContext.beginPath()
        canvasContext.fillStyle = color
        canvasContext.ellipse(position.x, position.y, radius.x, radius.y, 0, 0, Math.PI * 2, false)
        canvasContext.fill()
        canvasContext.closePath()
    }
}