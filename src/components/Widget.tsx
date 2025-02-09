import React, { useState } from "react";
import { motion } from "framer-motion";

const Widget: React.FC = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div 
            className="widget"
            initial={{ width: 200, height: 150 }}
            animate={{ width: expanded ? 400 : 200, height: expanded ? 300 : 150 }}
            transition={{ duration: 0.3 }}
            onClick={() => setExpanded(!expanded)}
            style={{ background: "#f0f0f0", border: "1px solid #ccc", cursor: "pointer", padding: "10px" }}
        >
            <h3>Expandable Widget</h3>
            {expanded && <p>More details...</p>}
        </motion.div>
    );
};

export default Widget;
