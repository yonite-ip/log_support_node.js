import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import { motion } from "framer-motion";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Widget options
const widgetOptions = [
  { id: "inbound", name: "Inbound Route", color: "bg-blue-500" },
  { id: "destination", name: "Destination", color: "bg-green-500" },
  { id: "time_condition", name: "Time Condition", color: "bg-yellow-500" },
  { id: "ivr_menu", name: "IVR Menu", color: "bg-purple-500" },
  { id: "ring_group", name: "Ring Group", color: "bg-red-500" },
  { id: "extension", name: "Extension", color: "bg-indigo-500" },
];

const Dashboard: React.FC = () => {
  const [widgets, setWidgets] = useState<any[]>([]);

  const addWidget = (widgetId: string) => {
    const newWidget = widgetOptions.find((w) => w.id === widgetId);
    if (newWidget) {
      setWidgets((prevWidgets) => [
        ...prevWidgets,
        { ...newWidget, key: `${widgetId}-${Date.now()}`, x: 0, y: 0, w: 4, h: 2 },
      ]);
    }
  };

  const removeWidget = (key: string) => {
    setWidgets((prevWidgets) => prevWidgets.filter((w) => w.key !== key));
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">📊 Interactive Dashboard</h2>

      {/* Widget Selector */}
      <div className="flex space-x-2 mb-4">
        {widgetOptions.map((widget) => (
          <button
            key={widget.id}
            className={`p-2 rounded-lg text-white ${widget.color}`}
            onClick={() => addWidget(widget.id)}
          >
            {widget.name}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <GridLayout
        className="layout"
        layout={widgets.map((w, index) => ({
          i: w.key,
          x: (index % 3) * 4,
          y: Math.floor(index / 3) * 2,
          w: 4,
          h: 2,
        }))}
        cols={12}
        rowHeight={120}
        width={1400}
        draggableHandle=".drag-handle"
      >
        {widgets.map((widget) => (
          <motion.div
            key={widget.key}
            className={`widget ${widget.color} text-white p-4 rounded-lg shadow-md`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="drag-handle cursor-grab text-lg font-semibold">{widget.name}</div>
            <p className="text-sm">Drag & Resize</p>
            <button
              className="mt-2 bg-gray-700 p-1 text-xs rounded"
              onClick={() => removeWidget(widget.key)}
            >
              Remove
            </button>
          </motion.div>
        ))}
      </GridLayout>
    </div>
  );
};

export default Dashboard;
