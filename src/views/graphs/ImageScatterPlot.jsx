import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

import json from "../../data/testData";
import { useMatchContext } from "../../contexts/matchContext";

export default function ImageScatterPlot() {
  const { playerUuid } = useMatchContext();
  const containerRef = useRef(null);

  const [playerData] = useState(() => {
    let totalPicks = 0;
    const formatedData = json
      .map(({ info: { participants } }) =>
        participants.find(({ puuid }) => puuid === playerUuid)
      )
      .filter((p) => !!p)
      .map(({ championName, win }) => ({
        championName,
        win,
      }))
      .reduce((acc, { championName, win }) => {
        const stored = acc.get(championName);
        ++totalPicks;
        return acc.set(championName, {
          wins: win ? (stored?.wins ?? 0) + 1 : stored?.wins ?? 0,
          picks: (stored?.picks ?? 0) + 1,
        });
      }, new Map());

    const data = [];
    formatedData.forEach((v, k) => {
      data.push({
        championName: k,
        winRate: v.wins / v.picks,
        pickRate: v.picks / totalPicks,
      });
    });
    return data;
  });

  useEffect(() => {
    if (playerData === undefined || !containerRef.current) return;

    const plot = Plot.plot({
      inset: 20,
      x: { label: "Taxa de escolha →", grid: true, tickFormat: ".0%" },
      y: { label: "↑ Taxa de vitória", grid: true, tickFormat: ".0%" },
      marks: [
        Plot.ruleY([0]),
        Plot.ruleX([0]),
        Plot.areaY([[0], [d3.max(playerData, (d) => d.pickRate) ?? 0.1]], {
          fillOpacity: 0.1,
          fill: "red",
          x: "0",
          y1: 0,
          y2: 0.5,
        }),
        Plot.areaY([[0], [d3.max(playerData, (d) => d.pickRate) ?? 0.1]], {
          fillOpacity: 0.1,
          fill: "green",
          x: "0",
          y1: 0.5,
          y2: 1,
        }),
        Plot.image(playerData, {
          x: "pickRate",
          y: "winRate",
          r: 20,
          preserveAspectRatio: "xMidYMin slice",
          src: (d) => `/imgs/champions/${d.championName}.png`,
          width: 40,
          title: "championName",
        }),
      ],
    });

    containerRef.current.append(plot);

    return () => plot.remove();
  }, [playerData]);

  return (
    <section>
      <div className="block w-fit h-fit border-2 p-4" ref={containerRef} />
    </section>
  );
}
