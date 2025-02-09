import React, { useEffect } from "react";

const HoverSyncLists: React.FC = () => {
    const handleHover = (item: string) => {
        const matchingItems = document.querySelectorAll(`.preview-container .${item}`);
        matchingItems.forEach((el) => el.classList.add("highlight"));
    };

    const handleMouseLeave = (item: string) => {
        const matchingItems = document.querySelectorAll(`.preview-container .${item}`);
        matchingItems.forEach((el) => el.classList.remove("highlight"));
    };

    useEffect(() => {
        const treeContainer = document.querySelector(".tree-container");

        if (!treeContainer) return;

        const handleMouseOver = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains("tree-child")) {
                target.classList.forEach((item) => {
                    if (item.includes("item-")) {
                        handleHover(item);
                    }
                });
            }
        };

        const handleMouseOut = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains("tree-child")) {
                target.classList.forEach((item) => {
                    if (item.includes("item-")) {
                        handleMouseLeave(item);
                    }
                });
            }
        };

        treeContainer.addEventListener("mouseover", handleMouseOver);
        treeContainer.addEventListener("mouseout", handleMouseOut);

        return () => {
            treeContainer.removeEventListener("mouseover", handleMouseOver);
            treeContainer.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    return (
        <div className="flex gap-4">
            {/* Left List Section */}
            <div className="w-1/2 border p-4">
                <h2 className="font-bold text-lg mb-2">Left List</h2>
                <ul className="tree-container">
                    <li className="list-item tree-child item-1">Left Item 1</li>
                    <li className="list-item tree-child item-2">Left Item 2</li>
                    <li className="list-item tree-child item-3">Left Item 3</li>
                </ul>
            </div>

            {/* Right List Section */}
            <div className="w-1/2 border p-4">
                <h2 className="font-bold text-lg mb-2">Right List</h2>
                <ul className="preview-container">
                    <li className="list-item item-2">Right Item A</li>
                    <li className="list-item item-1">Right Item B</li>
                    <li className="list-item item-3">Right Item C</li>
                </ul>
            </div>
        </div>
    );
};

export default HoverSyncLists;
