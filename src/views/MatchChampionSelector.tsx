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
    <div className="bg-slate-700 border-2 border-white flex p-4 justify-center items-center h-[470px] sticky top-4">
      <ul className="bg-white h-full w-40">
        <li>
          <button
            className={`p-1 flex gap-x-2 items-center hover:bg-slate-400 w-full ${
              "T1" === matchChampion ? "bg-slate-300" : ""
            }`}
            onClick={() =>
              matchChampion === "T1"
                ? setMatchChampion(undefined)
                : setMatchChampion("T1")
            }
          >
            <span>Time Azul</span>
          </button>
        </li>
        {matchData.data?.info.participants.map(({ championName }, i) => {
          return (
            <>
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
              {i === 4 && (
                <>
                  <div className="border-2 border-slate-300"></div>
                  <button
                    className={`p-1 flex gap-x-2 items-center hover:bg-slate-400 w-full ${
                      "T2" === matchChampion ? "bg-slate-300" : ""
                    }`}
                    onClick={() =>
                      matchChampion === "T2"
                        ? setMatchChampion(undefined)
                        : setMatchChampion("T2")
                    }
                  >
                    <span>Time Vermelho</span>
                  </button>
                </>
              )}
            </>
          );
        })}
      </ul>
    </div>
  );
}
