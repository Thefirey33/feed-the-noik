import {useEffect} from "react";
import {
    AMOUNT_OF_IMAGES_LEFT, doCameraPositioning, doMobileFunctions, drawDebugText,
    GameEngineFunctions,
    KeyboardInputHandler,
    NikoEntity,
    renderMobileButton,
    Vector2
} from "./renderer/GameEngineFunctions.ts";
import {CAMERA_POSITION, CAMERA_VELOCITY, registerTilemap} from "./renderer/TilemapFunctions.ts";
import { isMobileUser, LanguageSystem, virtualMouseCursor } from "./renderer/GeneralStuff.ts";
import { DialogSystem } from "./renderer/DialogSystem.ts";

export function GameWindow(props: {width: number, height: number, isFullscreen: boolean, setFullscreenDispatch: React.Dispatch<React.SetStateAction<boolean>>}) {
    // If a fullscreen is requested, allow the element to do fullscreen stuff.
    useEffect(() => {
        const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        if (props.isFullscreen)
            gameCanvas.requestFullscreen()
    }, [props.isFullscreen])
    // When the component successfully mounts, start loading all the assets.
    useEffect(() => {
        let ALLOW_LAUNCH = false
        const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        // Fullscreen state controller.
        document.onfullscreenchange = () => {
            if (document.fullscreenElement != gameCanvas)
                props.setFullscreenDispatch(false)
        }
        const context = gameCanvas.getContext("2d")
        const keyboardInputHandler = new KeyboardInputHandler()
        // Entities that are very very crucial.
        const noikEntity = new NikoEntity(new Vector2(10 * 64, 8 * 64))
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
                alert("Engine Launching..")
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
                    gameCanvas.addEventListener("touchend", () => virtualMouseCursor.splice(0, virtualMouseCursor.length))
                }
                gameCanvas.style.cursor = "default";
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
                    // Calculate the size of the window we need to scale to.
                    doCameraPositioning(gameCanvas, noikEntity, deltaTime, CAMERA_VELOCITY, CAMERA_POSITION)
                    
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
                    // This function renders the mobile functions to the screen.
                    doMobileFunctions(isMobileUser, virtualMouseCursor, gameCanvas, context)

                    // Fullscreen support system.
                    // This is the engine check that allows for fullscreen.
                    if (document.fullscreenElement == gameCanvas)
                    {
                        if (isMobileUser)
                            renderMobileButton(context, new Vector2(0, 0), "Exit Fullscreen", "KeyF", new Vector2(100, 50), virtualMouseCursor, true)
                        else
                            GameEngineFunctions.DrawFont(context, new Vector2(0, 20), LanguageSystem.getLanguageData("stopFullscreen"), "red", 20)
                        if (KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyF"))
                        {
                            document.exitFullscreen()
                        }
                    }
                }, 1)
            }
        })
    }, []);

    return (
        <>
            <canvas className={"bg-black absolute m-auto left-0 outline-3 right-0 top-50 bottom-0 rounded-md outline-yellow-300"}
            style={{imageRendering: "pixelated"}}
                    id={"gameCanvas"}
                    width={props.isFullscreen ? window.innerWidth : props.width} height={props.isFullscreen ? window.innerHeight : props.height}></canvas>
        </>
    );
}