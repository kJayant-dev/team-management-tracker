import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusPieChart({ summary }) {
  if (!summary) return null;

  const data = {
    labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [
          summary.completed_activities || 0,
          summary.in_progress_activities || 0,
          summary.pending_activities || 0,
          summary.cancelled_activities || 0
        ],
        backgroundColor: [
          '#10b981', // Emerald
          '#06b6d4', // Cyan
          '#f59e0b', // Amber
          '#64748b'  // Slate
        ],
        borderColor: '#1e293b',
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
          padding: 16,
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
        padding: 12,
        boxPadding: 6
      }
    },
    cutout: '70%'
  };

  return (
    <div style={{ height: '260px', position: 'relative' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
