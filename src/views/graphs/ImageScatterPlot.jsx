import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";

import json from "./testData";
import { useMatchContext } from "../../contexts/matchContext";

export default function ImageScatterPlot() {
  const { playerUuid } = useMatchContext();
  const containerRef = useRef(null);

  const [playerData] = useState(() => {
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
        pickRate: v.picks,
      });
    });
    return data;
  });

  useEffect(() => {
    if (playerData === undefined || !containerRef.current) return;

    const plot = Plot.plot({
      inset: 20,
      x: { label: "Taxa de escolha →" },
      y: { label: "↑ Taxa de vitória", grid: true },
      marks: [
        Plot.ruleY([0]),
        Plot.image(playerData, {
          x: "pickRate",
          y: "winRate",
          src: () => "https://via.placeholder.com/100x100",
          width: 40,
          title: () => "championName",
        }),
      ],
    });

    containerRef.current.append(plot);

    return () => plot.remove();
  }, [playerData]);

  return <div className="block w-fit h-fit border-2 p-4" ref={containerRef} />;
}
