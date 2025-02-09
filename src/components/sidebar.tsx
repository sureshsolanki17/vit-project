import React from "react";

const Sidebar = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside className="w-1/4 p-4 bg-gray-200 border-r">
            <h3 className="mb-4 font-bold">Drag Nodes</h3>
            {["default", "input", "output", "process"].map((type) => (
                <div
                    key={type}
                    className="p-2 mb-2 bg-blue-500 text-white cursor-pointer rounded-md"
                    draggable
                    onDragStart={(event) => onDragStart(event, type)}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)} Node
                </div>
            ))}
        </aside>
    );
};

export default Sidebar;
