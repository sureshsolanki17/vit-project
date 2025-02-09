import React from "react";

interface CardProps {
    elements: { id: number; type: string; value: string; x: number; y: number }[];
    onDropElement: (type: string, x: number, y: number) => void;
    onSelectElement: (id: number) => void;
}

const Card: React.FC<CardProps> = ({ elements, onDropElement, onSelectElement }) => {
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const type = event.dataTransfer.getData("text/plain");
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        onDropElement(type, x, y);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div
            className="w-[400px] h-[250px] border border-gray-400 relative bg-white shadow-md"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {elements.map((el) => (
                <div
                    key={el.id}
                    style={{ position: "absolute", left: el.x, top: el.y }}
                    className="p-2 border bg-blue-200 cursor-pointer"
                    onClick={() => onSelectElement(el.id)}
                    draggable
                >
                    {el.value}
                </div>
            ))}
        </div>
    );
};

export default Card;
