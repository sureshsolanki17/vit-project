import { useCallback } from 'react';

import {
    Background,
    ReactFlow,
    addEdge,
    useNodesState,
    useEdgesState,
    MarkerType,
    useInternalNode,
    getStraightPath,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
    {
        id: '1',
        type: 'custom',
        position: { x: 0, y: 0 },
    },
    {
        id: '2',
        type: 'custom',
        position: { x: 250, y: 320 },
    },
    {
        id: '3',
        type: 'custom',
        position: { x: 40, y: 300 },
    },
    {
        id: '4',
        type: 'custom',
        position: { x: 300, y: 0 },
    },
];

const initialEdges: any[] = [];

const connectionLineStyle = {
    stroke: '#b1b1b7',
};

const nodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
    floating: FloatingEdge,
};

const defaultEdgeOptions = {
    type: 'floating',
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#b1b1b7',
    },
};

const EasyConnectExample = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className="h-screen w-screen">

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                nodeTypes={nodeTypes}
                style={{ backgroundColor: "#F7F9FB" }}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineComponent={CustomConnectionLine}
                connectionLineStyle={connectionLineStyle}
            >
                <Background />
            </ReactFlow>
        </div>
    );
};

export default EasyConnectExample;


function CustomConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }): any {
    const [edgePath] = getBezierPath({
        sourceX: fromX,
        sourceY: fromY,
        targetX: toX,
        targetY: toY,
    });

    return (
        <g>
            <path style={connectionLineStyle} fill="none" d={edgePath} />
        </g>
    );
}


import { Handle, Position, useConnection } from '@xyflow/react';
import { getBezierPath } from 'reactflow';

export function CustomNode({ id }) {
    const connection = useConnection();

    const isTarget = connection.inProgress && connection.fromNode.id !== id;

    const label = isTarget ? 'Drop here' : 'Drag to connect';

    return (
        <div className="customNode">
            <div
                className="customNodeBody"
            >
                {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
                {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
                {!connection.inProgress && (
                    <Handle
                        className="customHandle"
                        position={Position.Right}
                        type="source"
                    />
                )}
                {/* We want to disable the target handle, if the connection was started from this node */}
                {(!connection.inProgress || isTarget) && (
                    <Handle className="customHandle" position={Position.Left} type="target" isConnectableStart={false} />
                )}
                {label}
            </div>
        </div>
    );
}


function FloatingEdge({ id, source, target, markerEnd, style }: { id: any; source: any; target: any; markerEnd?: any; style: any }) {
    const sourceNode = useInternalNode(source);
    const targetNode = useInternalNode(target);

    if (!sourceNode || !targetNode) {
        return null;
    }

    const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

    const [edgePath] = getStraightPath({
        sourceX: sx,
        sourceY: sy,
        targetX: tx,
        targetY: ty,
    });

    return (
        <path
            id={id}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEnd}
            style={style}
        />
    );
}

function getNodeIntersection(intersectionNode, targetNode) {
    // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
    const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
        intersectionNode.measured;
    const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
    const targetPosition = targetNode.internals.positionAbsolute;

    const w = intersectionNodeWidth / 2;
    const h = intersectionNodeHeight / 2;

    const x2 = intersectionNodePosition.x + w;
    const y2 = intersectionNodePosition.y + h;
    const x1 = targetPosition.x + targetNode.measured.width / 2;
    const y1 = targetPosition.y + targetNode.measured.height / 2;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node, intersectionPoint) {
    const n = { ...node.internals.positionAbsolute, ...node };
    const nx = Math.round(n.x);
    const ny = Math.round(n.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1) {
        return Position.Left;
    }
    if (px >= nx + n.measured.width - 1) {
        return Position.Right;
    }
    if (py <= ny + 1) {
        return Position.Top;
    }
    if (py >= n.y + n.measured.height - 1) {
        return Position.Bottom;
    }

    return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, target) {
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);

    const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
    const targetPos = getEdgePosition(target, targetIntersectionPoint);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos,
        targetPos,
    };
}

export function createNodesAndEdges() {
    const nodes = [];
    const edges = [];
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    nodes.push({ id: 'target', data: { label: 'Target' }, position: center });

    for (let i = 0; i < 8; i++) {
        const degrees = i * (360 / 8);
        const radians = degrees * (Math.PI / 180);
        const x = 250 * Math.cos(radians) + center.x;
        const y = 250 * Math.sin(radians) + center.y;

        nodes.push({ id: `${i}`, data: { label: 'Source' }, position: { x, y } });

        edges.push({
            id: `edge-${i}`,
            target: 'target',
            source: `${i}`,
            type: 'floating',
            markerEnd: {
                type: MarkerType.Arrow,
            },
        });
    }

    return { nodes, edges };
}