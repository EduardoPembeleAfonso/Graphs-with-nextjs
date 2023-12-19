import { LineChart } from "./components/LineChart";
import { BarChart } from "./components/BarChart";

export default function Dashboard() {
  return (
    <div className="md:max-w-[1120px] flex flex-col items-center w-full mx-auto  text-white  md:pr-[4rem] min-h-screen sm:pb-[6rem] px-3 md:px-6 lg:px-8 overflow-x-hidden">
      {/* GRAFIC LINE AND INFO GRAPH LINE */}
      <LineChart />

      {/* GRAFIC BAR */}
      <BarChart />
    </div>
  );
}
