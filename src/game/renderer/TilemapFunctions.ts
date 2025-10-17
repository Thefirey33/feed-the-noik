
import {AnimatedImageAsset, KeyboardInputHandler, Vector2} from "./GameEngineFunctions.ts";

export const BASE_TILE_SIZE = new Vector2(64, 64)
export const ROOM_SIZE = new Vector2(20, 40)
export class TilemapPiece {
    textureData?: AnimatedImageAsset
    locationInformationCurrent: Vector2
    /**
     * To register a tilemap to the registry, an texture source is needed only.
     * @param textureSource The texture source of the tilemap, when the importing is going on, the TILES.dat file, will be fetched first to form the game world.
     */
    constructor(textureSource?: AnimatedImageAsset) {
        this.textureData = textureSource
        this.locationInformationCurrent = new Vector2(0, 0)
    }

    /**
     * This function returns the texture size for the tilemap renderer.
     */
    public getTextureSize(): Vector2 {
        if (this.textureData === undefined)
            return new Vector2(BASE_TILE_SIZE.x, BASE_TILE_SIZE.y);
        const textureFirst = this.textureData.imgArray[0].imgData
        return new Vector2(textureFirst.width, textureFirst.height)
    }

    /**
     * This function renders the tilemap to the game scene.
     * @param canvasContext This is the canvas context we want to render towards.
     * @param position This is the position of the tilemap piece, which is dictated by the Tilemap class.
     * @param deltaTime The deltatime for the animator to update.
     */
    public render(canvasContext: CanvasRenderingContext2D, position: Vector2, deltaTime: number){
        // If the texture data is undefined, do not render the object.
        if (this.textureData === undefined)
            return;
        const textureSizes = this.getTextureSize()
        // This renders the object if the object is only in range of the canvas.
        if (position.x >= -textureSizes.x && position.x <= canvasContext.canvas.width && position.y >= -textureSizes.y && position.y <= canvasContext.canvas.height)
            this.textureData.render(canvasContext, position, deltaTime, true, 0.001)
    }
}
export class SolidCollisionPiece extends TilemapPiece {
    renderThisTilemap: boolean = false
    constructor(textureSource: AnimatedImageAsset = new AnimatedImageAsset(["/game_assets/collision_piece.png"]), renderThisTilemap: boolean = false) {
        super(textureSource);
        this.renderThisTilemap = renderThisTilemap;
    }
    render(canvasContext: CanvasRenderingContext2D, position: Vector2, deltaTime: number) {
        if (KeyboardInputHandler.instance.checkIfKeyIsPressed("KeyQ") || this.renderThisTilemap)
            super.render(canvasContext, position, deltaTime)
    }
}
export const REGISTERED_TILEMAP_PIECES: (() => TilemapPiece)[] = [
    () => {return new SolidCollisionPiece()},
    () => {return new TilemapPiece(new AnimatedImageAsset(["/game_assets/sprites/tiles/floor_tile.png"]))},
    () => {return new SolidCollisionPiece(new AnimatedImageAsset(["/game_assets/sprites/tiles/wall_piece.png"]), true)},
]
export function registerTilemap() {
    const tilemapGrid: TilemapPiece[] = []
    fetch("/game_assets/TILES.dat")
        .then(r => r.text())
        .then(r => {
            // By the newline seperator, we start making the tilemap list one by one.
            const replacedValue = r.replaceAll("\n", "")
            for (let i = 0; i < replacedValue.length; i++) {
                const valueKey = replacedValue.charAt(i)
                const isNaNNumber = isNaN(parseInt(valueKey))
                if (!isNaNNumber) {
                    tilemapGrid.push(REGISTERED_TILEMAP_PIECES[parseInt(valueKey)]())
                }
            }
        })
    return new Tilemap(new Vector2(ROOM_SIZE.x, ROOM_SIZE.y), tilemapGrid)
}

/**
 * The position of the camera in-game.
 */
export const CAMERA_POSITION: Vector2 = new Vector2(0, 0)
export const CAMERA_VELOCITY = 5
export class Tilemap {
    tilemapSize: Vector2 = new Vector2(0, 0)
    allTiles: TilemapPiece[]
    constructor(tilemapSize: Vector2 = new Vector2(800, 600), allTiles: TilemapPiece[]) {
        this.tilemapSize = tilemapSize;
        this.allTiles = allTiles;
    }

    /**
     * This function renders the entire tilemap to the game window.
     * @param canvasContext
     * @param deltaTime The deltatime for the animator to use.
     */
    public render(canvasContext: CanvasRenderingContext2D, deltaTime: number){
        const tilePiecePosition: Vector2 = new Vector2(0, 32)
        for (let i = 0; i < this.allTiles.length; i++) {
            const currentTile = this.allTiles[i]
            if (currentTile.textureData == undefined)
                return;
            const tileMapTextureSize = currentTile.getTextureSize()
            if (i % this.tilemapSize.x === 0)
            {
                tilePiecePosition.x = 0;
                tilePiecePosition.y += tileMapTextureSize.y;
            }
            // If the tilemap renderer's current location is greater than the specified amount of tiles to be rendered, then do some cool stuff.
            const locationInformation = new Vector2(tilePiecePosition.x + CAMERA_POSITION.x, tilePiecePosition.y + CAMERA_POSITION.y)
            currentTile.locationInformationCurrent = locationInformation
            currentTile.render(canvasContext, locationInformation, deltaTime)
            tilePiecePosition.x += tileMapTextureSize.x;
        }
    }
    /**
     * This function gets the tilemap in that location.
     * @param position The location to check.
     * @returns The tilemap piece that's corresponding. If a tilemap hasn't been found in the context, then it will return undefined.
     */
    public getTilemapInThatLocation(position: Vector2): TilemapPiece | undefined {
        this.allTiles.forEach((_selfTilemapPiece) => {
            // The location of the tile in the current context. (Top-Left)
            const locationOfTile = _selfTilemapPiece.locationInformationCurrent
            const textureSizes = _selfTilemapPiece.getTextureSize()
            if (locationOfTile.x > position.x && locationOfTile.y > position.y && locationOfTile.x + textureSizes.x < position.x && locationOfTile.y + textureSizes.y < position.y)
                return _selfTilemapPiece  
        })
        return undefined;
    }
}