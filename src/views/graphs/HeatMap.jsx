import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";

import testData from "../../assets/data/BR1_2736749630-timeline.json";
// import { useMatchContext } from "../../contexts/matchContext";

// const playerIdByPuuid = testData.info.participants.reduce(
//   (acc, { participantId, puuid }) => {
//     acc[puuid] = participantId;
//     return acc;
//   },
//   {}
// );

export default function HeatMap() {
  // const { playerUuid } = useMatchContext();
  const containerRef = useRef(null);

  const [heatMapData] = useState(
    testData.info.frames.flatMap(({ participantFrames }) => {
      // const { x, y } = participantFrames[playerIdByPuuid[playerUuid]].position;
      return Object.entries(participantFrames).map(([, v]) => {
        return v.position;
      });
    })
  );

  useEffect(() => {
    if (heatMapData === undefined || !containerRef.current) return;

    const plot = Plot.plot({
      aspectRatio: 1,
      x: {
        axis: null,
        domain: [0, 14820],
      },
      y: {
        axis: null,
        domain: [0, 14881],
      },
      style: {
        backgroundImage: "url(/imgs/map.png)",
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backgroundSize: "100.5%",
        backfaceVisibility: "10%",
      },
      color: { scheme: "Purples" },
      marks: [
        Plot.hexgrid({}),
        Plot.dot(
          heatMapData,
          Plot.hexbin(
            { fill: "count" },
            {
              x: (d) => d.x,
              y: (d) => d.y,
            }
          )
        ),
      ],
    });
    containerRef.current.append(plot);

    return () => plot.remove();
  }, [heatMapData]);

  return (
    <section>
      <div className="block w-fit h-fit border-2 p-4" ref={containerRef} />
    </section>
  );
}
