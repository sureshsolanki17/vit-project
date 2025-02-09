import { useState } from "react";
import { treeData } from "./tree-data";
import { PdfSchema } from "./type";
import PdfComponent from "./pdf-component";

export const Tree = () => {
    const [items, setItems] = useState(treeData.children);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [hoveredDropZoneId, setHoveredDropZoneId] = useState<string | null>(null);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, id: string) => {
        setDraggedItemId(id);
        event.dataTransfer.setData("text/plain", id.toString());
    };

    const handleDragEnd = () => {
        setDraggedItemId(null);
        setHoveredDropZoneId(null);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>, id: string) => {
        event.preventDefault();
        setHoveredDropZoneId(id);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>, id: string) => {
        if (hoveredDropZoneId === id) {
            setHoveredDropZoneId(null);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetId: string) => {
        event.preventDefault();
        const droppedItemId = event.dataTransfer.getData("text/plain");
        console.log(droppedItemId, targetId)
        if (droppedItemId === null || draggedItemId === null || droppedItemId !== draggedItemId) {
            return;
        }

        const draggedIndex = items.findIndex(item => item.element_id.toString() === droppedItemId);
        const targetIndex = items.findIndex(item => item.element_id === targetId);

        if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
            return;
        }

        const newItems = [...items];
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedItem);
        setItems(newItems);
        setDraggedItemId(null);
        setHoveredDropZoneId(null);
    };

    return (
        <div className="bg-white border  flex flex-col  mx-auto">
            <PdfComponent data={items} updateSchema={setItems} />
        </div>
    );
};
