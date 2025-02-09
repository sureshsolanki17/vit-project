import { useState } from "react";

type BlockType = "button" | "text" | "input";

interface Block {
    id: string;
    type: BlockType;
    x: number;
    y: number;
}

const BlocksUI = () => {
    const [blocks] = useState<Block[]>([
        { id: "btn", type: "button", x: 0, y: 0 },
        { id: "txt", type: "text", x: 0, y: 0 },
        { id: "inp", type: "input", x: 0, y: 0 },
    ]);

    const [canvasBlocks, setCanvasBlocks] = useState<Block[]>([]);
    const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);

    // Handle Drag Start
    const handleDragStart = (block: Block) => {
        setDraggedBlock(block);
    };

    // Allow Drop
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    // Handle Drop
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        if (draggedBlock) {
            const dropX = event.clientX - 100; // Adjust offset
            const dropY = event.clientY - 50;

            setCanvasBlocks((prev) => [
                ...prev,
                { ...draggedBlock, id: `${draggedBlock.id}-${Date.now()}`, x: dropX, y: dropY },
            ]);

            setDraggedBlock(null);
        }
    };

    return (
        <div className="flex w-full">
            {/* Sidebar */}
            <div className="w-40 p-4 bg-gray-200 border-r border-gray-400">
                <h3 className="font-semibold mb-2">Blocks</h3>
                {blocks.map((block) => (
                    <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(block)}
                        className="cursor-pointer mb-2 p-2 bg-blue-500 text-white rounded-md text-center"
                    >
                        {block.type.toUpperCase()}
                    </div>
                ))}
            </div>

            {/* Canvas (Drop Area) */}
            <div
                className="w-full flex-1 p-4 relative border-2 border-dashed border-gray-400"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ minHeight: "400px", position: "relative" }}
            >
                <h3 className="font-semibold mb-2">Canvas</h3>

                {canvasBlocks.map((block) => (
                    <div
                        key={block.id}
                        className="w-full absolute p-2 border rounded-md shadow-md bg-white"
                        style={{ left: block.x, top: block.y }}
                    >
                        {block.type === "button" && <button className="px-4 py-2 bg-green-500 text-white rounded">Button</button>}
                        {block.type === "text" && <p className="text-lg">Text Block</p>}
                        {block.type === "input" && <input type="text" className="border px-2 py-1" placeholder="Input Field" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlocksUI;
