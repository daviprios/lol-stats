import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useCallback, useEffect, useRef, useState } from "react";

import infoJson from "../../assets/data/BR1_2736749630-info.json";
import timelineJson from "../../assets/data/BR1_2736749630-timeline.json";

const participants = infoJson.info.participants.map(
  ({ puuid, championName, teamId }) => {
    return { puuid, championName, teamId };
  }
);

const participantsSortedByTeam = participants.sort(
  ({ teamId: teamIdA }, { teamId: teamIdB }) => (teamIdA > teamIdB ? 1 : -1)
);

const championByParticipantId = timelineJson.info.participants
  .map(({ puuid, participantId }) => {
    return {
      participantId,
      championName: participants.find(({ puuid: ppuuid }) => puuid === ppuuid),
    };
  })
  .reduce((acc, { championName, participantId }) => {
    return { ...acc, [participantId]: championName };
  }, {});

const killerVictimRelation = timelineJson.info.frames.flatMap(({ events }) => {
  return events
    .filter(({ type }) => type === "CHAMPION_KILL")
    .map(({ killerId, victimId }) => {
      return {
        killer: championByParticipantId[killerId],
        victim: championByParticipantId[victimId],
      };
    });
});

const killGraph = killerVictimRelation.reduce(
  (
    acc,
    { killer: { championName: killer }, victim: { championName: victim } }
  ) => {
    const kills = acc[killer] || {};
    kills[victim] = (kills[victim] ?? 0) + 1;
    acc[killer] = kills;
    return acc;
  },
  {}
);

Object.values(championByParticipantId).map(({ championName }) => championName);

export default function GraphPlot() {
  const containerRef = useRef(null);
  const [dataNodes] = useState(
    [
      d3.pointRadial((Math.PI * 11) / 6, 70),
      d3.pointRadial((Math.PI * 10) / 6, 70),
      d3.pointRadial((Math.PI * 9) / 6, 70),
      d3.pointRadial((Math.PI * 8) / 6, 70),
      d3.pointRadial((Math.PI * 7) / 6, 70),

      d3.pointRadial((Math.PI * 1) / 6, 70),
      d3.pointRadial((Math.PI * 2) / 6, 70),
      d3.pointRadial((Math.PI * 3) / 6, 70),
      d3.pointRadial((Math.PI * 4) / 6, 70),
      d3.pointRadial((Math.PI * 5) / 6, 70),
    ].map((coord, i) => {
      return [...coord, participantsSortedByTeam[i].championName];
    })
  );

  const getEdgesData = useCallback(() => {
    return Object.entries(killGraph).flatMap(([killer, victimList]) => {
      return Object.entries(victimList).map(([victim, amount]) => {
        const killerNode = dataNodes.find(
          ([, , championName]) => championName === killer
        );
        const victimNode = dataNodes.find(
          ([, , championName]) => championName === victim
        );
        const color =
          participantsSortedByTeam.find(
            ({ championName }) => killer === championName
          ).teamId === 100
            ? "blue"
            : "red";
        return {
          killer: {
            x: killerNode[0],
            y: killerNode[1],
            championName: killer,
          },
          victim: {
            x: victimNode[0],
            y: victimNode[1],
            championName: victim,
          },
          amount,
          color,
        };
      });
    });
  }, [dataNodes]);

  const [dataEdges, setDataEdges] = useState(getEdgesData());
  useEffect(() => {
    setDataEdges(getEdgesData());
  }, [dataNodes, getEdgesData]);

  const getKillVictimInfo = useCallback(
    (championName) => {
      return `Kills:\n${dataEdges
        .filter(({ killer }) => killer.championName === championName)
        .map(({ victim, amount }) => `${victim.championName}: ${amount}`)
        .join("\n")}\n\nMortes:\n${dataEdges
        .filter(({ victim }) => victim.championName === championName)
        .map(({ killer, amount }) => `${killer.championName}: ${amount}`)
        .join("\n")}`;
    },
    [dataEdges]
  );

  useEffect(() => {
    if (dataEdges === undefined || !containerRef.current) return;

    const plot = Plot.plot({
      inset: 60,
      aspectRatio: 1,
      axis: null,
      marks: [
        Plot.image(dataNodes, {
          r: 40,
          preserveAspectRatio: "xMidYMin slice",
          src: (d) => `/imgs/champions/${d[2]}.png`,
          title: (d) => getKillVictimInfo(d[2]),
        }),

        Plot.arrow(dataEdges, {
          x1: ({ killer }) => killer.x,
          y1: ({ killer }) => killer.y,
          x2: ({ victim }) => victim.x,
          y2: ({ victim }) => victim.y,
          bend: true,
          // filter: (d) =>
          //   d.victim.championName === "Sett" ||
          //   d.killer.championName === "Sett",
          stroke: ({ color }) => color,
          strokeWidth: ({ amount }) => amount,
          strokeLinejoin: "miter",
          headLength: 15,
          inset: 60,
        }),

        Plot.text(dataNodes, {
          text: participantsSortedByTeam.map(
            ({ championName }) => championName
          ),
          dy: 50,
        }),
      ],
    });

    containerRef.current.append(plot);

    return () => plot.remove();
  }, [dataEdges, dataNodes, getKillVictimInfo]);

  return (
    <section>
      <div className="block w-fit h-fit border-2 p-4" ref={containerRef} />
    </section>
  );
}
