import { useMemo } from "react";
import { useMatchContext } from "../contexts/matchContext";

import jsonData from "../data/testData";

export default function MatchChampionSelector() {
  const { setMatchChampion, matchChampion, currentMatch } = useMatchContext();

  const matchData = useMemo(
    () => ({
      data: jsonData.find(
        ({ metadata: { matchId } }) => currentMatch === matchId
      )!,
    }),
    [currentMatch]
  );

  return (
    <div className="bg-slate-700 border-2 border-white flex p-4 justify-center items-center h-[400px]">
      <ul className="bg-white overflow-y-auto overflow-x-hidden h-full w-40">
        {matchData.data?.info.participants.map(({ championName }) => {
          return (
            <li key={championName}>
              <button
                className={`p-1 flex gap-x-2 items-center hover:bg-slate-400 w-full ${
                  championName === matchChampion ? "bg-slate-300" : ""
                }`}
                onClick={() =>
                  matchChampion === championName
                    ? setMatchChampion(undefined)
                    : setMatchChampion(championName)
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
