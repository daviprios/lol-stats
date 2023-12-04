import { useMemo } from "react";

import { useMatchContext } from "../contexts/matchContext";
import jsonData from "../data/testData";

export default function GlobalChampionSelector() {
  const { setGlobalChampion, globalChampion } = useMatchContext();
  const championList = useMemo(
    () =>
      jsonData.flatMap(({ info }) =>
        info.participants
          .map(({ championName }) => championName)
          .toSorted((championNameA, championNameB) =>
            championNameA > championNameB ? 1 : -1
          )
      ),
    []
  );

  return (
    <div className="bg-slate-700 border-2 border-white flex p-4 justify-center items-center mr-4 h-[400px] sticky top-4">
      <ul className="bg-white overflow-y-auto overflow-x-hidden h-full w-40">
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
