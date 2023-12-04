import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import jsonData from "../../data/testData";
import jsonDataTimeline from "../../data/testDataTimeline";
import { useMatchContext } from "../../contexts/matchContext";

export default function GraphPlot() {
  const containerRef = useRef(null);
  const { currentMatch, matchChampion } = useMatchContext();

  const matchData = useMemo(
    () => ({
      data: jsonData.find(
        ({ metadata: { matchId } }) => currentMatch === matchId
      ),
      timeline: jsonDataTimeline.find(
        ({ metadata: { matchId } }) => currentMatch === matchId
      ),
    }),
    [currentMatch]
  );

  const participants = useMemo(
    () =>
      matchData.data.info.participants.map(
        ({ puuid, championName, teamId }) => {
          return { puuid, championName, teamId };
        }
      ),
    [matchData]
  );

  const participantsSortedByTeam = useMemo(
    () =>
      participants.sort(({ teamId: teamIdA }, { teamId: teamIdB }) =>
        teamIdA > teamIdB ? 1 : -1
      ),
    [participants]
  );

  const championByParticipantId = useMemo(
    () =>
      matchData.timeline.info.participants
        .map(({ puuid, participantId }) => {
          return {
            participantId,
            championName: participants.find(
              ({ puuid: ppuuid }) => puuid === ppuuid
            ),
          };
        })
        .reduce((acc, { championName, participantId }) => {
          return { ...acc, [participantId]: championName };
        }, {}),
    [matchData, participants]
  );

  const killerVictimRelation = useMemo(
    () =>
      matchData.timeline.info.frames.flatMap(({ events }) => {
        return events
          .filter(({ type }) => type === "CHAMPION_KILL")
          .map(({ killerId, victimId }) => {
            return {
              killer: championByParticipantId[killerId],
              victim: championByParticipantId[victimId],
            };
          })
          .filter(({ killer }) => killer);
      }),
    [championByParticipantId, matchData]
  );

  const killGraph = useMemo(
    () =>
      killerVictimRelation.reduce(
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
      ),
    [killerVictimRelation]
  );

  const dataNodes = useMemo(
    () =>
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
      }),
    [participantsSortedByTeam]
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
  }, [dataNodes, killGraph, participantsSortedByTeam]);

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

  const filter = useCallback(
    (d) => {
      if (matchChampion === "T1") return d.color === "blue";
      if (matchChampion === "T2") return d.color === "red";
      return matchChampion
        ? d.victim.championName === matchChampion ||
            d.killer.championName === matchChampion
        : true;
    },
    [matchChampion]
  );

  useEffect(() => {
    if (dataEdges === undefined || !containerRef.current || !matchData) return;

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
          filter: (d) => filter(d),
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
  }, [
    dataEdges,
    dataNodes,
    getKillVictimInfo,
    matchData,
    participantsSortedByTeam,
    matchChampion,
    filter,
  ]);

  return (
    <section>
      <h2 className="text-center text-white text-xl font-semibold">
        Relação assassino-vitima
      </h2>
      <div className="block w-fit h-fit border-2 p-4" ref={containerRef} />
    </section>
  );
}
