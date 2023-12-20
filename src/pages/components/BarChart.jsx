/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { chartsData } from '../api/data'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
}

export function BarChart() {
  const [selectedMode, setSelectedMode] = React.useState('day') // Estado para controlar a opção selecionada no select
  const [displayMode, setDisplayMode] = React.useState('day') // Estado para controlar o modo de exibição (dia, mês ou ano)
  const [data, setData] = useState({ datasets: [] })
  const [isLoading, setIsloading] = useState(true)

  const _data = async () => {

    // pegando os dias e os seus valores
    const valuesByDay = chartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt)
      const day = date.toLocaleDateString('pt-BR', { weekday: 'long' })
      acc[day] = acc[day] ? acc[day] + curr.value : curr.value
      return acc
    }, {})
    
    // pegando os meses e os seus valores
    const valuesByMonth = chartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt)
      const month = date.toLocaleDateString('pt-BR', {
        month: 'long',
      })
      acc[month] = acc[month] ? acc[month] + curr.value : curr.value
      return acc
    }, {})

    // pegando os anos e os seus valores
    const valuesByYear = chartsData.reduce((acc, curr) => {
      const date = new Date(curr.createdAt)
      const year = date.getFullYear()
      acc[year] = acc[year] ? acc[year] + curr.value : curr.value
      return acc
    }, {})

    setData({
      labels:
        displayMode === 'day'
          ? Object.keys(valuesByDay)
          : displayMode === 'month'
          ? Object.keys(valuesByMonth)
          : Object.keys(valuesByYear),
      datasets: [
        {
          label: 'Vendas',
          data:
            displayMode === 'day'
              ? Object.values(valuesByDay)
              : displayMode === 'month'
              ? Object.values(valuesByMonth)
              : Object.values(valuesByYear),
          backgroundColor: '#8f143d',
        },
      ],
    })
  }

  // Atualiza os rótulos e dados com base no modo de exibição selecionado
  React.useEffect(() => {
    setSelectedMode(displayMode)
    setTimeout(() => {
      if (data) {
        _data()
        setIsloading(false)
      }
    }, 500)
  }, [displayMode])

  return (
    <div className="md:h-full bg-colorSearch w-full rounded-[20px] p-6 mt-8  ">
      <div className="flex flex-wrap lg:items-center justify-between gap-4 px-6 md:px-0">
        <h4 className="text-primaryColorDark text-2xl font-semibold">
          Gráfico de vendas
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
      </div>
      {isLoading ? (
        <div className="w-full min-h-[300px] flex justify-center items-center">
          <span className="text-primaryColorDark font-semibold text-2xl text-center my-auto mx-auto">
            Carregando...
          </span>
        </div>
      ) : (
        <Bar options={options} data={data} className="min-h-[300px]" />
      )}
    </div>
  )
}
