import { useMatchContext } from "./contexts/matchContext";

import MatchSelector from "./views/MatchSelector";
import MatchChampionSelector from "./views/MatchChampionSelector";

import ImageScatterPlot from "./views/graphs/ImageScatterPlot";
import MultiLineLabeled from "./views/graphs/MultiLineLabeled";
import GraphPlot from "./views/graphs/GraphPlot";
import HeatMap from "./views/graphs/HeatMap";
import GlobalChampionSelector from "./views/GlobalChampionSelector";

export default function App() {
  const { currentMatch } = useMatchContext();

  return (
    <main className="bg-slate-700">
      <header className="flex flex-col items-center mb-4">
        <h1 className="text-white text-2xl font-bold py-4">LoL Datavis</h1>
      </header>

      <article className="flex items-center py-4 flex-col gap-y-12">
        <div className="flex -ml-52">
          <GlobalChampionSelector />
          <div className="flex flex-col">
            <ImageScatterPlot />
            <MultiLineLabeled />
          </div>
        </div>
        <div className="flex gap-x-4 -ml-16">
          <MatchSelector />
          {currentMatch ? (
            <div className="flex flex-col gap-y-2">
              <GraphPlot />
              <HeatMap />
            </div>
          ) : (
            <></>
          )}
          <MatchChampionSelector />
        </div>
      </article>
    </main>
  );
}
