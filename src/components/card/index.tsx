import { useState } from "react";
import DraggableElement from "./element";
import Card from "./card";
import Sidebar from "./side";

interface ElementData {
    id: number;
    type: string;
    value: string;
    x: number;
    y: number;
}

const CardContenar: React.FC = () => {
    const [elements, setElements] = useState<ElementData[]>([]);
    const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

    const handleDropElement = (type: string, x: number, y: number) => {
        const newElement: ElementData = {
            id: Date.now(),
            type,
            value: type === "Text" ? "New Text" : "Element",
            x,
            y,
        };
        setElements([...elements, newElement]);
    };

    const handleSelectElement = (id: number) => {
        const element = elements.find((el) => el.id === id) || null;
        setSelectedElement(element);
    };

    const handleUpdateValue = (value: string) => {
        if (!selectedElement) return;
        setElements((prev) =>
            prev.map((el) => (el.id === selectedElement.id ? { ...el, value } : el))
        );
        setSelectedElement((prev) => (prev ? { ...prev, value } : null));
    };

    return (
        <div className="flex h-screen p-4 gap-4">
            {/* Left Sidebar (Draggable Elements) */}
            <div className="w-[150px] border-r p-4">
                <h3 className="font-bold mb-2">Elements</h3>
                <DraggableElement type="Text" />
                <DraggableElement type="Label" />
            </div>

            {/* Main eCard */}
            <Card elements={elements} onDropElement={handleDropElement} onSelectElement={handleSelectElement} />

            {/* Right Sidebar (Edit Panel) */}
            <Sidebar selectedElement={selectedElement} onUpdateValue={handleUpdateValue} />
        </div>
    );
};

export default CardContenar;