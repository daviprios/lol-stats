import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";

import presidents from "../../assets/test/presidents.json";

export default function ImageScatterPlot() {
  const containerRef = useRef(null);
  const [dataImage] = useState(
    presidents.map((p) => ({
      ...p,
      "First Inauguration Date": new Date(p["First Inauguration Date"]),
    }))
  );

  useEffect(() => {
    if (dataImage === undefined || !containerRef.current) return;

    const plot = Plot.plot({
      inset: 20,
      x: { label: "First inauguration date →" },
      y: { grid: true, label: "↑ Net favorability (%)", tickFormat: "+f" },
      marks: [
        Plot.ruleY([0]),
        Plot.image(dataImage, {
          x: "First Inauguration Date",
          y: (d) =>
            d["Very Favorable %"] +
            d["Somewhat Favorable %"] -
            d["Very Unfavorable %"] -
            d["Somewhat Unfavorable %"],
          src: "Portrait URL",
          width: 40,
          title: "Name",
        }),
      ],
    });

    containerRef.current.append(plot);

    return () => plot.remove();
  }, [dataImage]);

  return <div className="block w-fit h-fit border-2 p-4" ref={containerRef} />;
}
