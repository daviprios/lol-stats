import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";

import edges from "../../assets/test/edges.json";
import nodes from "../../assets/test/nodes.json";

export default function GraphPlot() {
  const containerRef = useRef(null);
  const [dataEdges] = useState(edges);
  const [dataNodes] = useState(nodes);

  useEffect(() => {
    if (
      dataEdges === undefined ||
      dataNodes === undefined ||
      !containerRef.current
    )
      return;

    const plot = Plot.plot({
      inset: 60,
      aspectRatio: 1,
      axis: null,
      marks: [
        Plot.dot(dataNodes, { r: 40 }),
        Plot.arrow(dataEdges, {
          x1: ([[x1]]) => x1,
          y1: ([[, y1]]) => y1,
          x2: ([, [x2]]) => x2,
          y2: ([, [, y2]]) => y2,
          bend: true,
          strokeWidth: ([, , value]) => value,
          strokeLinejoin: "miter",
          headLength: 24,
          inset: 48,
        }),
        Plot.text(dataNodes, { text: ["A", "B", "C"], dy: 12 }),
        Plot.text(dataEdges, {
          x: ([[x1, y1], [x2, y2]]) => (x1 + x2) / 2 + (y1 - y2) * 0.15,
          y: ([[x1, y1], [x2, y2]]) => (y1 + y2) / 2 - (x1 - x2) * 0.15,
          text: ([, , value]) => value,
        }),
      ],
    });

    containerRef.current.append(plot);

    return () => plot.remove();
  }, [dataEdges, dataNodes]);

  return <div className="block w-fit h-fit border-2 p-4" ref={containerRef} />;
}
