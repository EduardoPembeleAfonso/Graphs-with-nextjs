/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { barChartsData } from "../api/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
    },
  },
};

export function LineChart() {
  const [selectedMode, setSelectedMode] = useState("day"); // Estado para controlar a opção selecionada no select
  const [displayMode, setDisplayMode] = useState("day"); // Estado para controlar o modo de exibição (dia, mês ou ano)
  const [data, setData] = useState({ datasets: [] });
  const [isLoading, setIsloading] = useState(true);

  const _data = async () => {
    // pegando os dias e os seus valores de entrada
    const valuesByDay = barChartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      const day = date.toLocaleDateString("pt-BR", { weekday: "long" });
      acc[day] = acc[day] ? acc[day] + curr.value : curr.value;
      return acc;
    }, {});

    // pegando os dias e os seus custos
    const originalValueByDay = barChartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      const day = date.toLocaleDateString("pt-BR", { weekday: "long" });
      acc[day] = acc[day]
        ? parseInt(acc[day]) + parseInt(curr.original_value)
        : curr.original_value;
      return acc;
    }, {});

    // pegando os dias e os seus lucros
    const profitByDay = barChartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      const day = date.toLocaleDateString("pt-BR", { weekday: "long" });
      acc[day] = acc[day]
        ? acc[day] + parseInt(curr.value) - parseInt(curr.original_value)
        : parseInt(curr.value) - parseInt(curr.original_value);
      return acc;
    }, {});

    // pegando os meses e os seus valores de entrada
    const valuesByMonth = barChartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      const month = date.toLocaleDateString("pt-BR", {
        month: "long",
      });
      acc[month] = acc[month] ? acc[month] + curr.value : curr.value;
      return acc;
    }, {});

    // pegando os meses e os seus lucros
    const profitByMonth = barChartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      const month = date.toLocaleDateString("pt-BR", { month: "long" });
      acc[month] = acc[month]
        ? acc[month] + parseInt(curr.value) - parseInt(curr.original_value)
        : parseInt(curr.value) - parseInt(curr.original_value);
      return acc;
    }, {});

    // pegando os meses e os seus custos
    const originalValueByMonth = barChartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      const month = date.toLocaleDateString("pt-BR", { month: "long" });
      acc[month] = acc[month]
        ? parseInt(acc[month]) + parseInt(curr.original_value)
        : curr.original_value;
      return acc;
    }, {});

    // pegando os anos e os seus valores de entrada
    const valuesByYear = barChartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      const year = date.getFullYear();
      acc[year] = acc[year]
        ? parseInt(acc[year]) + parseInt(curr.value)
        : curr.value;
      return acc;
    }, {});

    // pegando os anos e os seus lucros
    const profitByYear = barChartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      const year = date.getFullYear();
      acc[year] = acc[year]
        ? acc[year] + parseInt(curr.value) - parseInt(curr.original_value)
        : parseInt(curr.value) - parseInt(curr.original_value);
      return acc;
    }, {});

    // pegando os anos e os seus custos
    const originalValueByYear = barChartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      const year = date.getFullYear();
      acc[year] = acc[year]
        ? parseInt(acc[year]) + parseInt(curr.original_value)
        : curr.original_value;
      return acc;
    }, {});

    setData({
      labels:
        displayMode === "day"
          ? Object.keys(valuesByDay)
          : displayMode === "month"
          ? Object.keys(valuesByMonth)
          : Object.keys(valuesByYear),
      datasets: [
        {
          label: "Ganhos",
          data:
            displayMode === "day"
              ? Object.values(profitByDay)
              : displayMode === "month"
              ? Object.values(profitByMonth)
              : Object.values(profitByYear),
          borderColor: "rgb(4, 188, 20)",
          backgroundColor: "rgb(2, 86, 9)",
        },

        {
          label: "Entradas",
          data:
            displayMode === "day"
              ? Object.values(valuesByDay)
              : displayMode === "month"
              ? Object.values(valuesByMonth)
              : Object.values(valuesByYear),
          borderColor: "rgb(244, 171, 12)",
          backgroundColor: "rgb(122, 84, 2)",
        },

        {
          label: "Custos",
          data:
            displayMode === "day"
              ? Object.values(originalValueByDay)
              : displayMode === "month"
              ? Object.values(originalValueByMonth)
              : Object.values(originalValueByYear),
          borderColor: "rgb(239, 14, 14)",
          backgroundColor: "#8f143d",
        },
      ],
    });
  };

  // Atualiza os rótulos e dados com base no modo de exibição selecionado
  useEffect(() => {
    setTimeout(() => {
      if (data) {
        _data();
        setIsloading(false);
      }
    }, 500);
    setSelectedMode(displayMode);
  }, [displayMode]);

  return (
    <div className="w-full flex flex-col max-lg:flex-col xl:flex-row  flex-wrap gap-6 mt-8 ">
      {/* GRAFIC */}
      <div className="w-full xl:w-[600px] flex-1 rounded-[20px]">
        <header className="flex flex-wrap bg-colorSearch items-center justify-between gap-4 w-full px-4 py-4 rounded-t-[20px]">
          <h4 className="text-primaryColorDark text-2xl font-semibold">
            Gráfico de renda
          </h4>
          <select
            value={selectedMode}
            onChange={(e) => setDisplayMode(e.target.value)}
            className="block rounded-md border-0 py-1.5 bg-transparent text-primaryColorDark cursor-pointer shadow-sm ring-1 ring-inset ring-primaryColor placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primaryColorDark sm:text-sm sm:leading-6"
          >
            <option
              value="day"
              className="bg-zinc-800 text-zinc-200 cursor-pointer p-2"
            >
              Day
            </option>
            <option
              value="month"
              className="bg-zinc-800 text-zinc-200 cursor-pointer p-2"
            >
              Month
            </option>
            <option
              value="year"
              className="bg-zinc-800 text-zinc-200 cursor-pointer p-2"
            >
              Year
            </option>
          </select>
        </header>
        {isLoading ? (
          <div className="w-full min-h-[300px] flex justify-center items-center bg-secondaryColor">
            <span className="text-primaryColorDark font-semibold text-2xl text-center my-auto mx-auto">
              Carregando...
            </span>
          </div>
        ) : (
          <Line
            options={options}
            data={data}
            className="min-h-[10rem] bg-colorSearch p-6 rounded-b-[20px] w-full text-white"
          />
        )}
      </div>
      {/* TABLE INFO GRAFICS */}
      <div className="rounded-[20px] bg-colorSearch p-6 shadow-lg w-full xl:w-[480px] flex-1 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-primaryColorDark rounded-[20px]">
            <tr className="rounded-t-[20px]">
              <th className="border-b border-primaryColorDark px-6 py-4 text-left text-xs text-gray-200 font-semibold uppercase tracking-wider">
                Tempo
              </th>
              <th className="border-b  border-primaryColorDark px-6 py-4 text-left text-xs text-gray-200 font-semibold uppercase tracking-wider">
                Entrada
              </th>
              <th className="border-b  border-primaryColorDark px-6 py-4 text-left text-xs text-gray-200 font-semibold uppercase tracking-wider">
                Custo
              </th>
              <th className="border-b border-primaryColorDark px-6 py-4 text-left text-xs text-gray-200 font-semibold uppercase tracking-wider">
                Ganho
              </th>
            </tr>
          </thead>
          <tbody>
            {data.labels &&
              data.labels.map((label, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {data.datasets[1].data[index]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {data.datasets[2].data[index]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {data.datasets[0].data[index]}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
