import { useEffect, useState } from "react";

type ShapeType = "Circle" | "Square" | "Triangle";

interface Shape {
    id: string;
    shape: ShapeType;
    x: number;
    y: number;
}

const DragAndDropShapes = () => {
    const [shapes] = useState([
        { id: "circle", shape: "Circle" },
        { id: "square", shape: "Square" },
        { id: "triangle", shape: "Triangle" },
    ]);

    const [pageItems, setPageItems] = useState<Shape[]>([]);
    const [draggedItem, setDraggedItem] = useState<{ item: Shape; index: number | null } | null>(null);

    // Handle Drag Start
    const handleDragStart = (item: Shape, index: number | null = null) => {
        setDraggedItem({ item, index });
    };

    // Allow Drop
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    // Handle Drop
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        if (draggedItem) {
            console.log(event.clientX, event.clientY);
            console.log(event.clientX, event.clientY);
            const dropZone = event.currentTarget.getBoundingClientRect(); // Get drop area position
            console.log("dropZone", dropZone);
            const dropX = event.clientX - dropZone.left; // Adjust X relative to drop area
            const dropY = event.clientY - dropZone.top;  // Adjust Y relative to drop area

            setPageItems((prev) => {
                if (draggedItem.index !== null) {
                    // Move existing item
                    const updatedItems = [...prev];
                    updatedItems[draggedItem.index] = { ...draggedItem.item, x: dropX, y: dropY };
                    return updatedItems;
                } else {
                    // Add new item
                    return [...prev, { ...draggedItem.item, id: `${draggedItem.item.id}-${Date.now()}`, x: dropX, y: dropY }];
                }
            });

            setDraggedItem(null);
        }
    };

    useEffect(() => {
        window.addEventListener("mousedown", (event) => {
            console.log(event.clientX, event.clientY);
        });
    }, []);

    return (
        <div className="flex w-full h-screen">
            {/* Sidebar */}
            <div className="w-40 p-4 bg-gray-200 border-r border-gray-400">
                <h3 className="font-semibold mb-2">Shapes Sidebar</h3>
                {shapes.map((item) => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart({ ...item, shape: item.shape as ShapeType, x: 0, y: 0 })}
                        className="cursor-pointer mb-4 p-4 text-center rounded-md"
                        style={{
                            backgroundColor: item.id === "circle" ? "lightblue" : item.id === "square" ? "lightgreen" : "lightcoral",
                            width: item.id === "circle" ? "60px" : "50px",
                            height: item.id === "circle" ? "60px" : "50px",
                            borderRadius: item.id === "circle" ? "50%" : "5px",
                        }}
                    >
                        {item.shape}
                    </div>
                ))}
            </div>

            {/* Page Area (Drop Zone) */}
            <div
                className="flex-1 p-4"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                    minHeight: "300px",
                    border: "2px dashed #ccc",
                    position: "relative",
                }}
            >
                <h3 className="font-semibold mb-2">Page</h3>
                {pageItems.length === 0 ? (
                    <p className="text-center">Drop shapes here!</p>
                ) : (
                    pageItems.map((item, index) => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart(item, index)}
                            className="absolute flex justify-center items-center cursor-move"
                            style={{
                                left: `${item.x - 50}px`,
                                top: `${item.y - 50}px`,
                                backgroundColor: item.id.includes("circle") ? "lightblue" : item.id.includes("square") ? "lightgreen" : "lightcoral",
                                width: item.id.includes("circle") ? "60px" : "50px",
                                height: item.id.includes("circle") ? "60px" : "50px",
                                borderRadius: item.id.includes("circle") ? "50%" : "5px",
                            }}
                        >
                            {item.shape}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DragAndDropShapes;
