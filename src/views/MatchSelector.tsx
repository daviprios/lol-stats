import moment from "moment";
import { useMatchContext } from "../contexts/matchContext";

import data from "../data/testData";

export default function MatchSelector() {
  const { currentMatch, setCurrentMatch, playerUuid } = useMatchContext();

  return (
    <div className="max-h-[640px] border-2 p-4">
      <ul className="h-full overflow-y-auto overflow-x-hidden">
        {data.map(
          ({
            info: { participants, gameStartTimestamp },
            metadata: { matchId },
          }) => {
            const player = participants.find(
              ({ puuid }) => puuid === playerUuid
            )!;

            return (
              <li key={matchId}>
                <button
                  onClick={() => setCurrentMatch(matchId)}
                  className={`flex ${`bg-${player.win ? "green-" : "red-"}${
                    currentMatch === matchId ? "500" : "300"
                  }`} p-2 items-center min-w-[220px] border-b-2 border-slate-700`}
                >
                  <img
                    src={`/imgs/champions/${player.championName}.png`}
                    className="w-10 h-10 mr-2"
                  />
                  <div className="flex flex-col items-start">
                    <div className="flex justify-between w-full">
                      <span className="font-semibold">
                        {player.kills}/{player.deaths}/{player.assists}
                      </span>
                      <span className="text-sm">
                        {player.totalMinionsKilled}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm">
                        {moment(gameStartTimestamp).format("l HH:mm")}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}
