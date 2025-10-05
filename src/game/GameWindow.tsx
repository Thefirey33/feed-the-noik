import {useEffect} from "react";
import {
    AMOUNT_OF_IMAGES_LEFT, drawDebugText,
    GameEngineFunctions,
    KeyboardInputHandler,
    Vector2
} from "./renderer/GameEngineFunctions.ts";
import {registerTilemap} from "./renderer/TilemapFunctions.ts";

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
        setInterval(() => {
            // DeltaTime calculation.
            const deltaTime = (Date.now() - OLD_DELTA_TIME);
            // If there are assets loading, do not permit rendering.
            GameEngineFunctions.ClearCanvas(context)
            if (keyboardInputHandler.checkIfKeyIsPressed("KeyD"))
                drawDebugText(context, deltaTime)
            if(AMOUNT_OF_IMAGES_LEFT.length > 0) {
                const textYPosition = new Vector2(0, 20)
                AMOUNT_OF_IMAGES_LEFT.forEach(value => {
                    GameEngineFunctions.DrawFont(context, textYPosition, `Loading ${value}...`, "white", 20)
                    textYPosition.y += 20;
                })
                return;
            }
            // Background tilemap rendering.
            generatedTilemap.render(context, deltaTime)
            OLD_DELTA_TIME = Date.now();
        })
    }, []);

    return (
        <>
            <canvas className={"bg-black absolute m-auto left-0 right-0 top-0 bottom-0 border-4 rounded-md border-yellow-300"}
                    id={"gameCanvas"}
                    width={640} height={480}></canvas>
        </>
    );
}