import React from "react";

interface SidebarProps {
    selectedElement: { id: number; value: string } | null;
    onUpdateValue: (value: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedElement, onUpdateValue }) => {
    if (!selectedElement) return <div className="p-4">Select an element to edit</div>;

    return (
        <div className="p-4 border-l w-[200px]">
            <label className="block mb-2">Edit Text:</label>
            <input
                type="text"
                value={selectedElement.value}
                onChange={(e) => onUpdateValue(e.target.value)}
                className="border p-1 w-full"
            />
        </div>
    );
};

export default Sidebar;
