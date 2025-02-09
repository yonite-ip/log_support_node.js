import React from "react";
import GridLayout from "react-grid-layout";
import Widget from "./Widget";
import "react-grid-layout/css/styles.css";

const Canvas: React.FC = () => {
    return (
        <GridLayout
            className="layout"
            layout={[{ i: "1", x: 0, y: 0, w: 2, h: 2 }]}
            cols={12}
            rowHeight={30}
            width={1200}
        >
            <div key="1"><Widget /></div>
        </GridLayout>
    );
};

export default Canvas;
