import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MemberPointsChart({ members }) {
  if (!members || members.length === 0) return null;

  // Sort by period points descending
  const sorted = [...members].sort((a, b) => b.period_points - a.period_points);

  const labels = sorted.map(m => m.name.split(' ')[0]);
  const periodPointsData = sorted.map(m => m.period_points || 0);
  const lifetimePointsData = sorted.map(m => m.lifetime_points || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Period Points',
        data: periodPointsData,
        backgroundColor: '#6366f1',
        borderRadius: 6,
        barThickness: 24
      },
      {
        label: 'Lifetime Points',
        data: lifetimePointsData,
        backgroundColor: 'rgba(148, 163, 184, 0.2)',
        borderRadius: 6,
        barThickness: 24
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
      }
    }
  };

  return (
    <div style={{ height: '260px', position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
