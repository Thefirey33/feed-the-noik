import {useState} from "react";
import {Vector2} from "../../game/renderer/GameEngineFunctions.ts";


export function DraggableObject(props: {imgSource: string, alt: string}) {
    const [isHovered, setIsHovered] = useState(false)
    const [position, setPosition] = useState(new Vector2(0, 0))
    const [isButtonPressed, setIsButtonPressed] = useState(false)
    const [heldButton, setHeldButton] = useState(false)
    const [movementSway, setMovementSway] = useState(new Vector2(1, 1))
    window.addEventListener("mousemove", (event) => {
        setIsButtonPressed(event.buttons === 1)
        if (isHovered && isButtonPressed || heldButton) {
            setPosition(position.addition(new Vector2(event.movementX, event.movementY)))
            setHeldButton(true)
            setMovementSway(new Vector2(1 + event.movementX / 50, 1 + event.movementY / 50))
        } else {
            setMovementSway(new Vector2(1, 1))
            setPosition(position)
        }
        if (!isButtonPressed)
        {
            setHeldButton(false)
        }
    })
    return (
        <>
            <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            className={`border-${(isHovered || heldButton) ? 2 : 0} border-white cursor-move w-fit rounded-md m-2`}
                    style={{transform: `translate(${position.x}px, ${position.y}px) scale(${movementSway.x}, ${movementSway.y})`}}
                    role="button">
                <img src={props.imgSource} alt={props.alt} width={100} draggable={false}/>
                <h1 className="text-white text-shadow-lg/30">{props.imgSource}</h1>
            </button>
        </>
    );
}