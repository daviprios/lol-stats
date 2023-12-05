import { useState, createContext, useContext } from "react";

const matchContext = createContext<{
  riotId: string;
  playerUuid: string;
  currentMatch: string | undefined;
  setCurrentMatch: (matchId: string | undefined) => void;
  globalChampion: string | undefined;
  setGlobalChampion: (championName: string | undefined) => void;
  matchChampion: string | undefined;
  setMatchChampion: (championName: string | undefined) => void;
}>({
  riotId: "",
  playerUuid: "",
  currentMatch: "",
  setCurrentMatch: () => {},
  globalChampion: "",
  setGlobalChampion: () => {},
  matchChampion: "",
  setMatchChampion: () => {},
});

export const useMatchContext = () => useContext(matchContext);

export default function MatchContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentMatch, setCurrentMatch] = useState<string | undefined>();
  const [globalChampion, setGlobalChampion] = useState<string | undefined>();
  const [matchChampion, setMatchChampion] = useState<string | undefined>();

  return (
    <matchContext.Provider
      value={{
        riotId: "Mordecai210#BR1",
        playerUuid:
          "ZTUMoFmTYIlucnpYO3hZwZ7O_KwVsaNMY3ojehWpz7IpF8bWbPQd4O8vnM9qur_2EOF1v6Pxx1ZSmA",
        currentMatch,
        setCurrentMatch,
        globalChampion,
        setGlobalChampion,
        matchChampion,
        setMatchChampion,
      }}
    >
      {children}
    </matchContext.Provider>
  );
}
