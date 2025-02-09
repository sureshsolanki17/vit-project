import React, { useCallback } from "react";
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    Connection,
    useNodesState,
    useEdgesState,
    useReactFlow,
    Node,
} from "reactflow";
import "reactflow/dist/style.css";

// ✅ Define custom node styles
const nodeTypes = {
    process: ({ data }: { data: { label: string } }) => (
        <div className="p-2 bg-yellow-400 rounded-md shadow-md">{data.label}</div>
    ),
};

const FlowCanvas = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const reactFlowInstance = useReactFlow();

    // ✅ Handle new connections
    const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

    // ✅ Handle drag-and-drop
    const onDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const type = event.dataTransfer.getData("application/reactflow");

        if (!type) return;

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        setNodes((nds) => [
            ...nds,
            {
                id: `${nds.length + 1}`,
                type: nodeTypes[type] ? type : "default", // ✅ Use "default" if type is missing
                position,
                data: { label: `${type} Node` },
                draggable: true,
            },
        ]);
    };

    return (
        <div
            className="w-3/4 h-screen bg-gray-100"
            onDrop={onDrop}
            onDragOver={(event) => event.preventDefault()}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                nodeTypes={nodeTypes} // ✅ Register custom nodes
            >
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default FlowCanvas;
