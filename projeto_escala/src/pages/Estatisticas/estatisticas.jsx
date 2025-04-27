import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Estatisticas({ escalas }) {
  const [dadosGrafico, setDadosGrafico] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (escalas) {
      const bases = Object.keys(escalas);
      const quantidadePorBase = bases.map(base => escalas[base].length);

      setDadosGrafico({
        labels: bases,
        datasets: [
          {
            label: 'Quantidade de Servidores por Base',
            data: quantidadePorBase,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }
        ]
      });
    }
  }, [escalas]);

  return (
    <div style={{ width: '80%', margin: '0 auto', paddingTop: '30px' }}>
      <h2>Estatísticas de Escalas</h2>
      <Bar
        data={dadosGrafico}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Servidores Escalados por Base',
            },
          },
        }}
      />
    </div>
  );
}
