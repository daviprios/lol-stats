import * as Plot from "@observablehq/plot";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";

import infoData from "../../data/infoData";
import { useMatchContext } from "../../contexts/matchContext";

const properties = {
  gold: "Ouro por minuto",
  kda: "KDA",
  cs: "CS por minuto",
  damage: "Dano a campeões",
  championName: "Campeão",
  time: "Data/Hora",
};

export default function MultiLineLabeled() {
  const { playerUuid, globalChampion } = useMatchContext();
  const containerRef = useRef(null);

  const [parameter, setParameter] = useState(properties.gold);
  const [result, setResult] = useState("ALL");

  const [playerData] = useState(
    infoData.map(({ info }) => {
      const player = info.participants.find(
        ({ puuid }) => puuid === playerUuid
      );
      return {
        [properties.gold]: Math.trunc(
          player.goldEarned / (info.gameDuration / 60)
        ),
        [properties.kda]: +(
          (player.kills + player.assists) /
          (player.deaths || 1)
        ).toFixed(2),
        [properties.cs]: Math.trunc(
          player.totalMinionsKilled / (info.gameDuration / 60)
        ),
        [properties.damage]: player.totalDamageDealtToChampions,
        win: player.win,
        [properties.time]: new Date(info.gameStartTimestamp),
        [properties.championName]: player.championName,
      };
    })
  );

  const filter = useCallback(
    (championName) => (globalChampion ? globalChampion === championName : true),
    [globalChampion]
  );

  useEffect(() => {
    if (playerData === undefined || !containerRef.current) return;

    const plot = Plot.plot({
      style: "overflow: visible;",
      y: { grid: true },
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(playerData, {
          filter: (d) =>
            (result === "ALL" ? true : result === "WIN" ? d.win : !d.win) &&
            filter(d[properties.championName]),
          x: properties.time,
          y: parameter,
          marker: "circle",
        }),
        Plot.tip(
          playerData,
          Plot.pointerX({
            filter: (d) =>
              (result === "ALL" ? true : result === "WIN" ? d.win : !d.win) &&
              filter(d[properties.championName]),
            x: properties.time,
            y: parameter,
            format: {
              x: (x) => moment(x).format("L HH:mm"),
            },
          })
        ),
        Plot.ruleX(
          playerData,
          Plot.pointerX({
            x: properties.time,
            py: parameter,
            stroke: "rgb(51, 65, 85)",
            filter: (d) =>
              (result === "ALL" ? true : result === "WIN" ? d.win : !d.win) &&
              filter(d[properties.championName]),
          })
        ),
        Plot.dot(
          playerData,
          Plot.pointerX({
            x: properties.time,
            y: parameter,
            stroke: "rgb(51, 65, 85)",
            filter: (d) =>
              (result === "ALL" ? true : result === "WIN" ? d.win : !d.win) &&
              filter(d[properties.championName]),
          })
        ),
      ],
    });

    containerRef.current.append(plot);

    return () => plot.remove();
  }, [playerData, result, parameter, filter]);

  return (
    <section className="flex flex-col">
      <h2 className="text-center text-white text-xl font-semibold">
        Estudo de parâmetros
      </h2>
      <div className="flex justify-between py-1">
        <label>
          <span className="text-white pr-1">Parâmetro</span>
          <select
            value={parameter}
            onChange={(e) => setParameter(e.currentTarget.value)}
            className="p-1 rounded-sm"
          >
            <option value={properties.gold}>Ouro por minuto</option>
            <option value={properties.kda}>KDA</option>
            <option value={properties.cs}>CS por minuto</option>
            <option value={properties.damage}>Dano a campeões</option>
          </select>
        </label>
        <label>
          <span className="text-white pr-1">Resultado da partida:</span>
          <select
            value={result}
            onChange={(e) => setResult(e.currentTarget.value)}
            className="p-1 rounded-sm"
          >
            <option value="ALL">Todos</option>
            <option value="WIN">Vitória</option>
            <option value="LOSS">Derrota</option>
          </select>
        </label>
      </div>
      <div className="block w-fit h-fit border-2 p-4" ref={containerRef} />
    </section>
  );
}
