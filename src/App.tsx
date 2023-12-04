import { useMatchContext } from "./contexts/matchContext";

import ImageScatterPlot from "./views/graphs/ImageScatterPlot";
import MultiLineLabeled from "./views/graphs/MultiLineLabeled";
import GraphPlot from "./views/graphs/GraphPlot";
import HeatMap from "./views/graphs/HeatMap";
import MatchSelector from "./views/MatchSelector";

export default function App() {
  const { currentMatch } = useMatchContext();

  return (
    <main className="bg-slate-700">
      <header className="flex flex-col items-center mb-4">
        <h1 className="text-white text-2xl font-bold py-4">
          Visualização de Dados
        </h1>
        <label className="text-white">
          <span className="pr-2">Riot ID</span>
          <input
            type="text"
            placeholder="Mordecai210#BR1"
            className="rounded-sm px-2 py-1"
          />
        </label>
      </header>

      <article className="flex items-center py-4 flex-col gap-y-2">
        <ImageScatterPlot />
        <MultiLineLabeled />
        <div className="flex gap-x-4">
          <MatchSelector />
          {currentMatch ? (
            <div className="flex flex-col gap-y-2">
              <h2 className="text-center text-white">
                Relação assassino-vitima
              </h2>
              <GraphPlot />
              <h2 className="text-center text-white">Heatmap dos jogadores</h2>
              <HeatMap />
            </div>
          ) : (
            <></>
          )}
        </div>
      </article>
    </main>
  );
}
