import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType, // Import the MarkerType enum
} from "reactflow";
import "reactflow/dist/style.css";

// Custom node component with input (target) and output (source) handles
const CustomNode: React.FC<any> = ({ data }) => {
  return (
    <div
      className={`relative p-4 text-white rounded-lg shadow-md cursor-pointer transition transform hover:scale-105 ${data.color}`}
      onClick={data.onClick}
    >
      {/* Input handle at the top */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <div>
        <strong>{data.event}</strong>
        {data.destination && <p>Destination: {data.destination}</p>}
        {data.expanded && <p className="mt-2 text-sm">Log: {data.log}</p>}
      </div>
      {/* Output handle at the bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </div>
  );
};

const AnalyzeCallFlow: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callFlow, setCallFlow] = useState<any[]>([]);
  const [callId, setCallId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  // We'll store user-created connections (edges) here
  const [edges, setEdges] = useState<Edge[]>([]);

  // Callback that handles interactive connections using markerEnd.
  const onConnect = useCallback(
    (params: Connection | Edge) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#555", // Explicit arrow color
              width: 20,
              height: 20,
            },
          },
          eds
        )
      ),
    []
  );

  const handleAnalyze = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a valid phone number.");
      return;
    }
    try {
      setError("");
      setCallFlow([]);
      setCallId(null);
      setEdges([]); // clear any previous connections
      setIsLoading(true);

      const response = await axios.post("http://localhost:5000/api/analyze", {
        phoneNumber,
      });
      setCallId(response.data.callId);
      setCallFlow(response.data.callFlow);
    } catch (err) {
      setError("No call flow found for this number.");
      setCallFlow([]);
      setCallId(null);
      setEdges([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine node background color based on event type.
  const getNodeColor = (event: string, isLast: boolean) => {
    if (isLast) return "bg-red-500";
    const colorMap: Record<string, string> = {
      "Call Routed": "bg-blue-500",
      "Time Condition Applied": "bg-yellow-500",
      "Call Sent to Ring Group": "bg-green-500",
      "Call Routed to an Extension": "bg-indigo-500",
      "Call Passed Through an IVR": "bg-purple-500",
    };
    return colorMap[event] || "bg-gray-500";
  };

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Create nodes from the callFlow array.
  // Each node uses our CustomNode via the "custom" node type.
  const nodes: Node[] = useMemo(() => {
    return callFlow.map((event, index) => ({
      id: `${index}`,
      type: "custom", // use our custom node with handles
      draggable: true,
      position: { x: index * 250, y: 100 },
      data: {
        event: event.event,
        destination: event.destination,
        log: event.log,
        expanded: expandedNodes[`${index}`],
        color: getNodeColor(event.event, index === callFlow.length - 1),
        onClick: () => toggleExpand(`${index}`),
      },
    }));
  }, [callFlow, expandedNodes]);

  // Register our custom node type with ReactFlow.
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Analyze Call Flow
        </h2>

        {/* Input Section */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Enter Phone Number
          </h3>
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              className="p-3 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition disabled:opacity-50"
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Analyze Call Flow 🔍"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {callId && (
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                Call Flow for Call ID: {callId}
              </h3>
              <button
                className="p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
            <div className="h-[500px] border border-gray-300 rounded">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
              >
                <Background color="#aaa" gap={16} />
                <Controls />
              </ReactFlow>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeCallFlow;
