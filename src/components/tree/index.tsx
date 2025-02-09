import { useState } from "react";
import { treeData } from "./tree-data";
import PdfComponent from "./pdf-component";

export const Tree = () => {
    const [items, setItems] = useState(treeData.children);

    return (
        <div className="bg-white border  flex flex-col  mx-auto">
            <PdfComponent data={items} updateSchema={setItems} />
        </div>
    );
};
