import {useEffect} from "react";
import {
    AMOUNT_OF_IMAGES_LEFT, drawDebugText,
    GameEngineFunctions,
    KeyboardInputHandler,
    Vector2
} from "./renderer/GameEngineFunctions.ts";
import {CAMERA_POSITION, registerTilemap} from "./renderer/TilemapFunctions.ts";

export function GameWindow() {
    // When the component successfully mounts, start loading all the assets.
    useEffect(() => {
        const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        const context = gameCanvas.getContext("2d")
        const keyboardInputHandler = new KeyboardInputHandler()
        // If the context is null, then give out an error message.
        if (context === null) {
            alert("Whoops! Your browser doesn't support canvas.")
            return;
        }
        // Register all the tilemap pieces to the game window.
        const generatedTilemap = registerTilemap()
        let OLD_DELTA_TIME = 0;
        let keptLoadingStrings: string[] = []
        setInterval(() => {
            keptLoadingStrings = []
            // DeltaTime calculation.
            const deltaTime = (Date.now() - OLD_DELTA_TIME);
            // If there are assets loading, do not permit rendering.
            GameEngineFunctions.ClearCanvas(context)
            if (keyboardInputHandler.checkIfKeyIsPressed("KeyQ"))
                drawDebugText(context, deltaTime)
            if(AMOUNT_OF_IMAGES_LEFT.length > 0) {
                const textYPosition = new Vector2(0, 20)
                AMOUNT_OF_IMAGES_LEFT.forEach(value => {
                    const loadingString = `Loading ${value}...`
                    if (!(keptLoadingStrings.includes(loadingString))) {
                        keptLoadingStrings.push(loadingString)
                        GameEngineFunctions.DrawFont(context, textYPosition, loadingString, "white", 20)
                        textYPosition.y += 20;
                    }
                })
                return;
            }
            const horizontalX = KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyA") ? 1 : (KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyD") ? -1 : 0)
            const verticalY = KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyW") ? 1 : (KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyS") ? -1 : 0)
            // These are for debugging purposes only.
            CAMERA_POSITION.x += horizontalX * 300 * GameEngineFunctions.getActualDeltaTimeNumber(deltaTime)
            CAMERA_POSITION.y += verticalY * 300 * GameEngineFunctions.getActualDeltaTimeNumber(deltaTime)
            // Background tilemap rendering.
            generatedTilemap.render(context, deltaTime)
            OLD_DELTA_TIME = Date.now()
        }, 1)
    }, []);

    return (
        <>
            <canvas className={"bg-black absolute m-auto left-0 right-0 top-0 bottom-0 border-4 rounded-md border-yellow-300"}
                    id={"gameCanvas"}
                    width={640} height={480}></canvas>
        </>
    );
}