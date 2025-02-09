import React, { useState } from 'react';
import { PdfSchema } from './type';

// - when element pick hide from current index 
// - swap show with full opacity 
// - where i insert proper add not up and dwon error 
// - update new tree whith unick key 


type PdfComponentType = {
    data: PdfSchema[];
    updateSchema: (schema: PdfSchema[]) => void;
}

const PdfComponent: React.FC<PdfComponentType> = ({ data, updateSchema }) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpand = (key: string) => {
        const newExpandedItems = new Set(expandedItems);
        if (newExpandedItems.has(key)) {
            newExpandedItems.delete(key);
        } else {
            newExpandedItems.add(key);
        }
        setExpandedItems(newExpandedItems);
    };

    const findBtn = (ele: HTMLElement): string => {
        if (ele) {
            const dragId = ele?.getAttribute("data-btn");
            if (dragId) {
                return dragId;
            }
            return findBtn(ele?.parentElement as HTMLElement);
        }
        return "";
    };

    const renderItem = (item: PdfSchema) => {
        const isExpanded = expandedItems.has(item.key);

        if (item.children && item.children.length > 0) {
            return (
                <div key={item.key}>
                    <div
                        className="h-5 drop-zone transition-[height] duration-200 ease-in"
                        drop-id={item.element_id}
                    >
                    </div>
                    <div draggable id={item.key} element-id={item.element_id} className=" border border-gray-300 rounded p-2">
                        <div
                            className="flex items-center justify-between ml-6"
                        >
                            <h3 className="text-lg font-medium flex gap-4 items-center">
                                <span data-btn={item.element_id}>
                                    <DragIcon />
                                </span>
                                {item.fieldName || item.alias}
                            </h3>
                            <span className='bg-orange-300 cursor-pointer  p-2' onClick={() => toggleExpand(item.key)}>{isExpanded ? "-" : "+"}</span>
                        </div>
                        {isExpanded && (
                            <div className="ml-4 mt-2">
                                {item.children.map(renderItem)}
                            </div>
                        )}
                    </div>
                </div>
            );
        } else {
            return (
                <div key={item.key}>
                    <div
                        className="h-5 drop-zone-card transition-[height] duration-200 ease-in"
                        style={{
                            backgroundColor: 'lightblue'
                        }}
                    >
                        child drop here
                    </div>
                    <div draggable id={item.key} element-id={item.element_id} className="p-2 border border-gray-200 rounded flex gap-4 items-center">
                        <p className="font-medium">{item.fieldName || item.alias}</p>
                        <p className="text-sm text-gray-500">Data Type: {item.data_type}</p>
                        <p className="text-sm text-gray-500">Element Tag: {item.elementTag}</p>
                    </div>
                </div>

            );
        }
    };


    const handleDragStart = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.stopPropagation()
        const elem: HTMLElement = ev.target as HTMLElement;
        console.log("elem", elem)
        const elementId = elem.getAttribute('element-id');

        console.log("elementId", elementId)

        if (elementId) {
            ev.dataTransfer.setData("text/plain", elementId);
            // deleteElementById(elementId, data)
        }
    };

    const handleDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault(); // This is essential to allow a drop
        const elem: HTMLElement = ev.target as HTMLElement;
        if (elem.classList.contains('drop-zone')) {
            elem.style.height = '78px';
        }
    };

    const handleDragLeave = (ev: React.DragEvent<HTMLDivElement>) => {
        const elem: HTMLElement = ev.target as HTMLElement;
        if (elem.classList.contains('drop-zone')) {
            elem.style.height = '20px';
        }
    };

    const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault(); // This is essential for a drop

        const elem: HTMLElement = ev.target as HTMLElement;
        if (elem.classList.contains('drop-zone')) {
            elem.style.height = '20px';

            const dropId = elem.getAttribute('drop-id') as string;
            const selectId = ev.dataTransfer.getData("text/plain"); // Get the ID
            console.log("Dropped on:", dropId, "\n", "Dragged:", selectId);

            const selectElement = findElementById(data, selectId) as PdfSchema
            const selectElementIndex = findElementIndex(data, selectId) as number

            // const dropOnIdIndex = findElementIndex(data, dropId)
            // const cloneData = [...data]

            data.splice(selectElementIndex, 1);
            const dropElementIndex = findElementIndex(data, dropId) as number;

            const insert = insertElementAtIndex(data, "", dropElementIndex, selectElement)
            if (insert) {
                updateSchema(insert)
            }
            // Now you have both the drop target ID and the dragged element ID.
            // Perform your logic here to update the state, move elements, etc.
        }
    };

    return (
        <div className="container p-4"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {data.map(renderItem)}
        </div>
    );
};

export default PdfComponent;

function findElementIndex(schema: PdfSchema[], elementId: string, parentChildren: boolean = false): number | null {
    for (let i = 0; i < schema.length; i++) {
        const element = schema[i];

        if (element.element_id === elementId) {
            return i;
        }

        // Recursively search in children if it's not a parent's children search or if the current element has children
        if (element.children && (parentChildren || element.children.length > 0)) {
            const childIndex = findElementIndex(element.children, elementId, false); // Important: Pass false for parentChildren in recursive call
            if (childIndex !== null) {
                return childIndex; // Return the index found in the children
            }
        }
    }

    return null;
}

function findElementById(schema: PdfSchema[], elementId: string): PdfSchema | null {
    for (let i = 0; i < schema.length; i++) {
        const element = schema[i];

        if (element.element_id === elementId) {
            return element; // Found the element!
        }

        if (element.children) {
            const foundInChildren = findElementById(element.children, elementId);
            if (foundInChildren) {
                return foundInChildren; // Found in the children!
            }
        }
    }

    return null; // Element not found
}

function updateElementById(schema: PdfSchema[], elementId: string, updatedProperties: Partial<PdfSchema>): boolean {
    for (let i = 0; i < schema.length; i++) {
        const element = schema[i];

        if (element.element_id === elementId) {
            // Update the element with the provided properties
            Object.assign(element, updatedProperties);
            return true; // Element found and updated
        }

        if (element.children) {
            if (updateElementById(element.children, elementId, updatedProperties)) {
                return true; // Element found and updated in children
            }
        }
    }
    return false; // Element not found
}

function insertElementAtIndex(schema: PdfSchema[], parentId: string | null | "", index: number, newElement: PdfSchema): PdfSchema[] | null {
    if (parentId === "") {
        if (index >= 0 && index <= schema.length) {
            const newSchema = [...schema]; // Create a shallow copy of the schema
            newSchema.splice(index, 0, newElement);
            return newSchema;
        } else {
            console.error("Invalid index:", index, "for root array.");
            return null;
        }
    }

    const newSchema = schema.map(element => { // Create a new array with updated elements
        const updatedElement = { ...element }; // Shallow copy of the element

        if (updatedElement.element_id === parentId || (parentId === null && updatedElement.parent_id === null)) {
            if (updatedElement.children) {
                if (index >= 0 && index <= updatedElement.children.length) {
                    const newChildren = [...updatedElement.children]; // Shallow copy of children
                    newChildren.splice(index, 0, newElement);
                    updatedElement.children = newChildren;
                    return updatedElement;
                } else {
                    console.error("Invalid index:", index, "for parent with ID:", parentId);
                    return element; // Return original element if index is invalid
                }
            } else {
                console.error("Parent with ID:", parentId, "does not have children.");
                return element; // Return original element
            }
        }

        if (updatedElement.children) {
            const updatedChildren = insertElementAtIndex(updatedElement.children, parentId, index, newElement);
            if (updatedChildren) {
                updatedElement.children = updatedChildren;
                return updatedElement;
            }
        }
        return element; // Return original element if no change
    });
    return newSchema;
}

function DragIcon() {
    return (
        <svg width="10" height="15" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="size-4 cursor-grab">
            <path d="M4 14.5C4 15.6 3.1 16.5 2 16.5C0.9 16.5 0 15.6 0 14.5C0 13.4 0.9 12.5 2 12.5C3.1 12.5 4 13.4 4 14.5ZM2 6.5C0.9 6.5 0 7.4 0 8.5C0 9.6 0.9 10.5 2 10.5C3.1 10.5 4 9.6 4 8.5C4 7.4 3.1 6.5 2 6.5ZM2 0.5C0.9 0.5 0 1.4 0 2.5C0 3.6 0.9 4.5 2 4.5C3.1 4.5 4 3.6 4 2.5C4 1.4 3.1 0.5 2 0.5ZM8 4.5C9.1 4.5 10 3.6 10 2.5C10 1.4 9.1 0.5 8 0.5C6.9 0.5 6 1.4 6 2.5C6 3.6 6.9 4.5 8 4.5ZM8 6.5C6.9 6.5 6 7.4 6 8.5C6 9.6 6.9 10.5 8 10.5C9.1 10.5 10 9.6 10 8.5C10 7.4 9.1 6.5 8 6.5ZM8 12.5C6.9 12.5 6 13.4 6 14.5C6 15.6 6.9 16.5 8 16.5C9.1 16.5 10 15.6 10 14.5C10 13.4 9.1 12.5 8 12.5Z" fill="white"></path>
        </svg>
    )
}