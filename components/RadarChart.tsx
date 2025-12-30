
import React, { useEffect, useRef } from 'react';
import { Chart, RadarController, LineElement, PointElement, RadialLinearScale, Filler, Tooltip, Legend, ChartConfiguration } from 'chart.js';

Chart.register(RadarController, LineElement, PointElement, RadialLinearScale, Filler, Tooltip, Legend);

interface RadarChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
    fill?: boolean;
    borderDash?: number[];
  }[];
}

const RadarChart: React.FC<RadarChartProps> = ({ labels, datasets }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const config: ChartConfiguration = {
      type: 'radar',
      data: {
        labels,
        datasets: datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.color,
          backgroundColor: ds.fill ? `${ds.color}44` : 'transparent',
          pointBackgroundColor: ds.color,
          borderWidth: 2,
          borderDash: ds.borderDash,
          fill: ds.fill ?? false,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2,
              display: false,
            },
            grid: {
              color: '#e2e8f0',
            },
            angleLines: {
              color: '#e2e8f0',
            },
            pointLabels: {
              font: {
                size: 13,
                family: 'Noto Sans SC'
              },
              color: '#64748b'
            }
          }
        },
        plugins: {
          legend: {
            display: datasets.length > 1,
            position: 'bottom',
          }
        }
      }
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    chartInstance.current = new Chart(chartRef.current, config);

    return () => {
      chartInstance.current?.destroy();
    };
  }, [labels, datasets]);

  return (
    <div className="w-full aspect-square max-w-[400px] mx-auto py-6">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default RadarChart;
