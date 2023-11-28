import ImageScatterPlot from "./views/graphs/ImageScatterPlot";
import MultiLineLabeled from "./views/graphs/MultiLineLabeled";
import GraphPlot from "./views/graphs/GraphPlot";

export default function App() {
  return (
    <div className="flex items-center py-4 flex-col gap-y-2 bg-slate-700">
      <p className="text-white">Visualização de Dados</p>
      <ImageScatterPlot />
      <MultiLineLabeled />
      <GraphPlot />
    </div>
  );
}
