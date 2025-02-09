import React, { useCallback } from "react";
import ReactFlow, {
    Background,
    Controls,
    Node,
    Edge,
    addEdge,
    Connection,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    ConnectionMode,
    Handle,
    Position
} from "reactflow";
import "reactflow/dist/style.css";

// Initial Nodes and Edges
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Custom Node Components
const InputNode = ({ data }: { data: { label: string } }) => (
    <div className="p-4 bg-green-500 text-white rounded-lg">
        <Handle type="source" position={Position.Right} />
        {data.label}
    </div>
);

const OutputNode = ({ data }: { data: { label: string } }) => (
    <div className="p-4 bg-red-500 text-white rounded-lg">
        {data.label}
        <Handle type="target" position={Position.Left} />
    </div>
);

const DefaultNode = ({ data }: { data: { label: string } }) => (
    <div className="p-4 bg-blue-500 text-white rounded-lg">
        <Handle type="target" position={Position.Left} />
        {data.label}
        <Handle type="source" position={Position.Right} />
    </div>
);

const FlowChart: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);

    // Handle new connections between nodes
    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    // Handle drag-and-drop from sidebar
    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            const type = event.dataTransfer.getData("application/reactflow");
            if (!type) return;

            const position = {
                x: event.clientX - event.currentTarget.getBoundingClientRect().left,
                y: event.clientY - event.currentTarget.getBoundingClientRect().top,
            };

            const newNode: Node = {
                id: `${nodes.length + 1}`,
                type,
                position,
                data: { label: `${type} Node ${nodes.length + 1}` },
            };

            setNodes((nds) => [...nds, newNode]);
        },
        [nodes, setNodes]
    );

    return (
        <ReactFlowProvider>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="w-1/4 bg-gray-200 p-4">
                    <h2 className="text-lg font-bold mb-4">Sidebar</h2>

                    {/* Default Node */}
                    <div
                        className="p-2 bg-blue-500 text-white cursor-pointer rounded mb-2"
                        draggable
                        onDragStart={(event) =>
                            event.dataTransfer.setData("application/reactflow", "default")
                        }
                    >
                        Default Node
                    </div>

                    {/* Input Node */}
                    <div
                        className="p-2 bg-green-500 text-white cursor-pointer rounded mb-2"
                        draggable
                        onDragStart={(event) =>
                            event.dataTransfer.setData("application/reactflow", "input")
                        }
                    >
                        Input Node
                    </div>

                    {/* Output Node */}
                    <div
                        className="p-2 bg-red-500 text-white cursor-pointer rounded"
                        draggable
                        onDragStart={(event) =>
                            event.dataTransfer.setData("application/reactflow", "output")
                        }
                    >
                        Output Node
                    </div>
                </div>

                {/* Flow Editor */}
                <div
                    className="w-3/4 h-full bg-white"
                    onDrop={onDrop}
                    onDragOver={(event) => event.preventDefault()}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        connectionMode={ConnectionMode.Loose} // Allow easy connections
                        nodeTypes={{
                            input: InputNode,
                            output: OutputNode,
                            default: DefaultNode,
                        }}
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
            </div>
        </ReactFlowProvider>
    );
};

export default FlowChart;
