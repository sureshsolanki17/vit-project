import React from "react";

interface DraggableElementProps {
    type: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ type }) => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("text/plain", type);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="border p-2 mb-2 cursor-pointer bg-gray-200"
        >
            {type}
        </div>
    );
};

export default DraggableElement;
