import * as Plot from "@observablehq/plot";
import { useEffect, useMemo, useRef } from "react";

import jsonData from "../../data/testData";
import jsonDataTimeline from "../../data/testDataTimeline";
import { useMatchContext } from "../../contexts/matchContext";

export default function HeatMap() {
  const { currentMatch } = useMatchContext();
  const containerRef = useRef(null);

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

  const heatMapData = useMemo(
    () =>
      matchData.timeline.info.frames.flatMap(({ participantFrames }) => {
        return Object.entries(participantFrames).map(([k, v]) => {
          return { ...v.position, championName: championByParticipantId[k] };
        });
      }),
    [championByParticipantId, matchData]
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
