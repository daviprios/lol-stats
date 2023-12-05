import { useMemo } from "react";

import { useMatchContext } from "../contexts/matchContext";
import infoData from "../data/infoData";

export default function GlobalChampionSelector() {
  const { setGlobalChampion, globalChampion, playerUuid } = useMatchContext();
  const championList = useMemo(
    () =>
      Array.from(
        infoData
          .flatMap(({ info }) =>
            info.participants.filter(({ puuid }) => puuid === playerUuid)
          )
          .reduce(
            (acc, { championName }) => acc.add(championName),
            new Set<string>()
          )
      ).toSorted((championNameA, championNameB) =>
        championNameA > championNameB ? 1 : -1
      ),
    []
  );

  return (
    <div className="bg-slate-700 border-2 border-white flex p-4 justify-center items-center mr-4 h-fit sticky top-4">
      <ul className="bg-white overflow-y-auto overflow-x-hidden max-h-[400px] w-40">
        {championList.map((championName) => {
          return (
            <li key={championName}>
              <button
                className={`p-1 flex gap-x-2 items-center hover:bg-slate-400 w-full ${
                  championName === globalChampion ? "bg-slate-300" : ""
                }`}
                onClick={() =>
                  globalChampion === championName
                    ? setGlobalChampion(undefined)
                    : setGlobalChampion(championName)
                }
              >
                <img
                  src={`/imgs/champions/${championName}.png`}
                  className={"w-7 h-7"}
                />
                <span>{championName}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
