import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { bloodSugarAPI } from '../services/api';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const BloodSugarChart = ({ simulatedSeries = [] }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await bloodSugarAPI.getRecords(30);
      const records = response.data.records.sort((a, b) => new Date(a.measurement_time) - new Date(b.measurement_time));

      // Filter for last 24h or last 50 readings for demo
      const recentRecords = records.slice(-50);

      const labels = recentRecords.map((r) =>
        new Date(r.measurement_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      const data = recentRecords.map((r) => r.glucose_level);
      setChartData({ labels, data });
    } catch (error) {
      toast.error('Échec du chargement du graphique');
    }
  };

  const labels = simulatedSeries.length > 0
    ? simulatedSeries.map((p) => p.time)
    : chartData?.labels;
  const data = simulatedSeries.length > 0
    ? simulatedSeries.map((p) => p.glucose)
    : chartData?.data;

  if (!labels || !data) return <div className="loading-spinner">Chargement des donnees...</div>;

  const dataConfig = {
    labels,
    datasets: [
      {
        label: 'Glycemie',
        data,
        borderColor: '#32503C',
        backgroundColor: 'rgba(50, 80, 60, 0.12)',
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
      {
        label: 'Limite haute',
        data: data.map(() => 180),
        borderColor: 'rgba(22, 163, 74, 0.3)',
        borderDash: [6, 4],
        pointRadius: 0,
      },
      {
        label: 'Limite basse',
        data: data.map(() => 70),
        borderColor: 'rgba(22, 163, 74, 0.3)',
        borderDash: [6, 4],
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 50, max: 290 },
      x: { ticks: { maxRotation: 0 } },
    },
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Line data={dataConfig} options={options} />
    </div>
  );
};

export default BloodSugarChart;
