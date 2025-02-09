import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  ReactFlowProvider,
  MarkerType,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "reactflow/dist/style.css";
import {
  FaRoute,
  FaClock,
  FaNetworkWired,
  FaProjectDiagram,
  FaUsers,
  FaPhone,
} from "react-icons/fa";

const widgetOptions = [
  { id: "inbound", name: "Inbound Route", icon: <FaRoute /> },
  { id: "destination", name: "Destination", icon: <FaNetworkWired /> },
  { id: "time_condition", name: "Time Condition", icon: <FaClock /> },
  { id: "ivr_menu", name: "IVR Menu", icon: <FaProjectDiagram /> },
  { id: "ring_group", name: "Ring Group", icon: <FaUsers /> },
  { id: "extension", name: "Extension", icon: <FaPhone /> },
];

const BuildDomain: React.FC = () => {
  const [widgets, setWidgets] = useState<any[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const savedWidgets = localStorage.getItem("domainConfig");
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

  useEffect(() => {
    const updatedNodes: Node[] = widgets.map((widget, index) => ({
      id: widget.key,
      data: { label: widget.name },
      position: { x: index * 200, y: 100 },
      type: "default",
      draggable: true,
      style: { width: 150, height: 80 },
    }));
    setNodes(updatedNodes);
  }, [widgets]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds));
  }, []);

  const addWidget = (widgetId: string) => {
    const newWidget = widgetOptions.find((w) => w.id === widgetId);
    if (newWidget) {
      const key = `${widgetId}-${Date.now()}`;
      setWidgets((prev) => [...prev, { ...newWidget, key }]);
    }
  };

  const removeWidget = (key: string) => {
    setWidgets((prev) => prev.filter((w) => w.key !== key));
    setEdges((prev) => prev.filter((e) => e.source !== key && e.target !== key));
  };

  return (
    <div className="max-w-11xl mx-auto bg-white p-8">
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Build Your FreeSWITCH Domain</h2>
      <div className="border border-gray-300 p-4 rounded-lg shadow-md bg-gray-50 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Widgets</h3>
        <div className="flex space-x-4 overflow-x-auto">
          {widgetOptions.map((widget) => (
            <button
              key={widget.id}
              className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              onClick={() => addWidget(widget.id)}
            >
              {widget.icon}
              <span>{widget.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="border border-gray-300 p-4 rounded-lg shadow-md bg-gray-50 relative" style={{ height: 600, width: "100%" }}>
        <ReactFlowProvider>
          <div style={{ width: "100%", height: "100%" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="top-right"
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              snapToGrid={true}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default BuildDomain;
