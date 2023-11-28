import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";

import stocks from "../../assets/test/stocks.json";

export default function MultiLineLabeled() {
  const containerRef = useRef(null);
  const [dataStock] = useState(
    stocks.map(({ Date: date, ...rest }) => ({
      ...rest,
      Date: new Date(date),
    }))
  );

  useEffect(() => {
    if (dataStock === undefined || !containerRef.current) return;

    const plot = Plot.plot({
      style: "overflow: visible;",
      y: { grid: true },
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(dataStock, { x: "Date", y: "Close", stroke: "Symbol" }),
        Plot.text(
          dataStock,
          Plot.selectLast({
            x: "Date",
            y: "Close",
            z: "Symbol",
            text: "Symbol",
            textAnchor: "start",
            dx: 3,
          })
        ),
      ],
    });

    containerRef.current.append(plot);

    return () => plot.remove();
  }, [dataStock]);

  return <div className="block w-fit h-fit border-2 p-4" ref={containerRef} />;
}
