import {useEffect} from "react";
import {
    AMOUNT_OF_IMAGES_LEFT, drawDebugText,
    GameEngineFunctions,
    KeyboardInputHandler,
    NikoEntity,
    Vector2
} from "./renderer/GameEngineFunctions.ts";
import {CAMERA_POSITION, CAMERA_VELOCITY, registerTilemap} from "./renderer/TilemapFunctions.ts";
import { isMobileUser, LanguageSystem, SoundSystem, virtualMouseCursor } from "../GeneralStuff.ts";
import { DialogSystem } from "./renderer/DialogSystem.ts";

export function GameWindow() {
    // When the component successfully mounts, start loading all the assets.
    useEffect(() => {
        let ALLOW_LAUNCH = false
        const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        const context = gameCanvas.getContext("2d")
        const keyboardInputHandler = new KeyboardInputHandler()
        // Entities that are very very crucial.
        const noikEntity = new NikoEntity(new Vector2(gameCanvas.width, gameCanvas.height))
        // If the context is null, then give out an error message.
        if (context === null) {
            alert("Whoops! Your browser doesn't support canvas.")
            return;
        }
        // Register all the tilemap pieces to the game window.
        const generatedTilemap = registerTilemap()
        let OLD_DELTA_TIME = 0;
        let keptLoadingStrings: string[] = []
        // Starting point.
        GameEngineFunctions.ClearCanvas(context)
        GameEngineFunctions.DrawFont(context, new Vector2(0, gameCanvas.height / 2), LanguageSystem.getLanguageData("clickHereToStart"), "white", 20)
        gameCanvas.style.cursor = "pointer";
        // This begins the game loop.
        gameCanvas.addEventListener("click", () => {
            if (!ALLOW_LAUNCH)
            {
                if (isMobileUser)
                {
                    gameCanvas.addEventListener("contextmenu", (contextMenu) => {
                        contextMenu.preventDefault()
                    })
                    function handleTouchEvent(touchEvent: TouchEvent){
                        touchEvent.preventDefault()
                        gameCanvas.focus()
                        const touchLocation = touchEvent.changedTouches.item(0)
                        if (touchLocation != undefined)
                        {
                            // This thing gets the nearest location of the touch that the current player holds.
                            virtualMouseCursor.push(
                                new Vector2(
                                    touchLocation.pageX - gameCanvas.offsetLeft, 
                                    touchLocation.pageY - gameCanvas.offsetTop
                                )
                            )
                        }
                    }
                    gameCanvas.addEventListener("touchmove", (touchEvent) => {
                        virtualMouseCursor.splice(0, virtualMouseCursor.length)
                        handleTouchEvent(touchEvent)
                    })
                    gameCanvas.addEventListener("touchstart", (touchEvent) => handleTouchEvent(touchEvent))
                    gameCanvas.addEventListener("touchend", (lastTouchEvent) => virtualMouseCursor.splice(0, virtualMouseCursor.length))
                }
                gameCanvas.style.cursor = "default";
                // Play the background music.
                SoundSystem.playAudio("bgm", true)
                ALLOW_LAUNCH = true
                setInterval(() => {
                    keptLoadingStrings = []
                    // DeltaTime calculation.
                    let deltaTime = (Date.now() - OLD_DELTA_TIME);
                    if (deltaTime == Date.now())
                        deltaTime = 0
                    // If there are assets loading, do not permit rendering.
                    GameEngineFunctions.ClearCanvas(context)
                    if(AMOUNT_OF_IMAGES_LEFT.length > 0) {
                        const textYPosition = new Vector2(0, 20)
                        AMOUNT_OF_IMAGES_LEFT.forEach(value => {
                            const loadingString = `Loading ${value}...`
                            if (!(keptLoadingStrings.includes(loadingString))) {
                                keptLoadingStrings.push(loadingString)
                                GameEngineFunctions.DrawFont(context, new Vector2(0, gameCanvas.height - 10), "Tendrillion", "red", 20)
                                GameEngineFunctions.DrawFont(context, textYPosition, loadingString, "white", 20)
                                textYPosition.y += 20;
                        }
                    })
                    return;
                    }
            
                    // Base level camera positioning system.
                    if (KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyQ"))
                    {
                        const horizontalX = KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyA") ? 1 : (KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyD") ? -1 : 0)
                        const verticalY = KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyW") ? 1 : (KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyS") ? -1 : 0)
                        CAMERA_POSITION.x += horizontalX * 300 * GameEngineFunctions.getActualDeltaTimeNumber(deltaTime)
                        CAMERA_POSITION.y += verticalY * 300 * GameEngineFunctions.getActualDeltaTimeNumber(deltaTime)
                    }
                    else
                    {
                        function returnDeltaTimedCameraPos(cameraPos: number,  cameraRealPos: number){
                            return (cameraPos - cameraRealPos) * GameEngineFunctions.getActualDeltaTimeNumber(deltaTime) * CAMERA_VELOCITY;
                        }
                        // COOL CAMERA SYSTEM.
                        const futureCameraPositionX = -(noikEntity.position.x) + gameCanvas.width / 2
                        const futureCameraPositionY = -(noikEntity.position.y) + gameCanvas.height / 2
                        // Camera Position System
                        CAMERA_POSITION.addition_self(new Vector2(returnDeltaTimedCameraPos(futureCameraPositionX, CAMERA_POSITION.x), returnDeltaTimedCameraPos(futureCameraPositionY, CAMERA_POSITION.y)))
                    }
                    generatedTilemap.render(context, deltaTime)
                    // Render the noik Entity, probably the most important entity in the whole game.
                    noikEntity.render_this_object(context, deltaTime, CAMERA_POSITION)
                    // Render the current dialog.
                    DialogSystem.renderDialog(context, deltaTime)
                    // Draw the debug stuff.
                    if (keyboardInputHandler.checkIfKeyIsPressed("KeyQ"))
                        drawDebugText(context, deltaTime)
                    OLD_DELTA_TIME = Date.now()
                    // Render the mobile controls to the screen if we are on mobile.
                    if (isMobileUser)
                    {
                        function renderMobileButton(context: CanvasRenderingContext2D, position: Vector2, text: string, controlToActive: string, scale: Vector2 = new Vector2(50, 50)){
                            let isHoveringOverThisItem = false
                            virtualMouseCursor.forEach((virtualMouseCursorPos) => {
                                if (!isHoveringOverThisItem)
                                    isHoveringOverThisItem = (virtualMouseCursorPos.x > position.x && virtualMouseCursorPos.y > position.y && position.x + scale.x > virtualMouseCursorPos.x && position.y + scale.y > virtualMouseCursorPos.y)
                            })
                            const newColorToRender = isHoveringOverThisItem ? 100 : 0
                            GameEngineFunctions.RenderRect(context, position.addition(new Vector2(-3, -3)), scale.addition(new Vector2(6, 6)), "white")
                            GameEngineFunctions.RenderRect(context, position, scale, `rgba(${newColorToRender}, ${newColorToRender}, ${newColorToRender}, 1)`)
                            GameEngineFunctions.DrawFont(context, position.addition(new Vector2(0, scale.y * 0.8)), text, "white", 20)
                            const indexOfThing = KeyboardInputHandler.instance.currentPressedKeyCollection.indexOf(controlToActive)
                            if (indexOfThing == -1 && isHoveringOverThisItem)
                                KeyboardInputHandler.instance.currentPressedKeyCollection.push(controlToActive)
                            else if (indexOfThing != -1 && !(isHoveringOverThisItem))
                                KeyboardInputHandler.instance.currentPressedKeyCollection.splice(indexOfThing, 1)
                        }
                        const scaleOfButton = 50
                        const leftMargin = 30
                        const positionYOfLeftControl = gameCanvas.height / 1.5
                        renderMobileButton(context, new Vector2(leftMargin , positionYOfLeftControl), "Left", "KeyA", new Vector2(scaleOfButton, scaleOfButton))
                        renderMobileButton(context, new Vector2(leftMargin + scaleOfButton + 5, positionYOfLeftControl - scaleOfButton), "Up", "KeyW", new Vector2(scaleOfButton, scaleOfButton))
                        renderMobileButton(context, new Vector2(leftMargin + scaleOfButton + 5, positionYOfLeftControl + scaleOfButton), "Down", "KeyS", new Vector2(scaleOfButton, scaleOfButton))
                        renderMobileButton(context, new Vector2(leftMargin + (scaleOfButton * 2) + 10, positionYOfLeftControl), "Right", "KeyD", new Vector2(scaleOfButton, scaleOfButton))
                        renderMobileButton(context, new Vector2(gameCanvas.width - scaleOfButton * 2, positionYOfLeftControl), "Use", "KeyE", new Vector2(scaleOfButton, scaleOfButton))
                    }
                }, 1)
            }
        })
    }, []);

    return (
        <>
            <canvas className={"bg-black absolute m-auto left-0 right-0 top-0 bottom-0 border-4 rounded-md border-yellow-300"}
            style={{imageRendering: "pixelated"}}
                    id={"gameCanvas"}
                    width={640} height={480}></canvas>
        </>
    );
}