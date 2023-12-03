import ImageScatterPlot from "./views/graphs/ImageScatterPlot";
import MultiLineLabeled from "./views/graphs/MultiLineLabeled";
import GraphPlot from "./views/graphs/GraphPlot";
import MatchContext from "./contexts/matchContext";
import HeatMap from "./views/graphs/HeatMap";

export default function App() {
  return (
    <MatchContext>
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
          <p className="text-white">Gráficos</p>
          <ImageScatterPlot />
          <MultiLineLabeled />
          <GraphPlot />
          <HeatMap />
        </article>
      </main>
    </MatchContext>
  );
}
