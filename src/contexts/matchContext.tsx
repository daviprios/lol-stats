import { useState, createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import HeaderInterceptor from "../assets/api/HeaderInterceptor";

const matchContext = createContext<{
  riotId: string;
  setRiotId: (id: string) => void;
  playerUuid: string;
  matchList: string[];
  currentMatch: string | undefined;
  setCurrentMatch: (matchId: string) => void;
}>({
  riotId: "",
  setRiotId: () => {},
  playerUuid: "",
  matchList: [],
  currentMatch: "",
  setCurrentMatch: () => {},
});

export const useMatchContext = () => useContext(matchContext);

export default function MatchContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [riotId, setRiotId] = useState<string | undefined>();
  const [currentMatch, setCurrentMatch] = useState<string | undefined>();

  const uuidQuery = useQuery({
    queryKey: ["riotId", riotId],
    queryFn: async () => {
      if (riotId === undefined) return;
      const [gameName, tagLine] = riotId.split("#");
      const res = await fetch(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
        HeaderInterceptor()
      );
      return (await res.json()) as {
        puuid: string;
        gameName?: string;
        tagLine?: string;
      };
    },
    enabled: !!riotId,
  });

  const matchListQuery = useQuery({
    queryKey: ["matchList", uuidQuery.data?.puuid],
    queryFn: async () => {
      if (uuidQuery.data?.puuid === undefined) return;
      const res = await fetch(
        `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${uuidQuery.data.puuid}/ids?start=0&count=20`,
        HeaderInterceptor()
      );
      return (await res.json()) as string[];
    },
    enabled: !!uuidQuery.data?.puuid,
  });

  return (
    <matchContext.Provider
      value={{
        riotId: riotId ?? "Mordecai210#BR1",
        setRiotId,
        playerUuid:
          uuidQuery.data?.puuid ??
          "ZTUMoFmTYIlucnpYO3hZwZ7O_KwVsaNMY3ojehWpz7IpF8bWbPQd4O8vnM9qur_2EOF1v6Pxx1ZSmA",
        matchList: matchListQuery?.data ?? [],
        currentMatch,
        setCurrentMatch,
      }}
    >
      {children}
    </matchContext.Provider>
  );
}
