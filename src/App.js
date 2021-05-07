import './App.css';
import {useState} from 'react';
import ranks from "./rank.json";
import { Line } from "react-chartjs-2";

const rankTypes = [
  'General',
  'Scout',
  'Soldier',
  'Pyro',
  'Demoman',
  'Heavy',
  'Engineer',
  'Medic',
  'Sniper',
  'Spy'
]

const colorScheme = [
  "#25CCF7",
  "#FD7272",
  "#54a0ff",
  "#00d2d3",
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#ecf0f1",
  "#95a5a6",
  "#f39c12",
  "#d35400",
  "#c0392b",
  "#bdc3c7",
  "#7f8c8d",
  "#55efc4",
  "#81ecec",
  "#74b9ff",
  "#a29bfe",
  "#dfe6e9",
  "#00b894",
  "#00cec9",
  "#0984e3",
  "#6c5ce7",
  "#ffeaa7",
  "#fab1a0",
  "#ff7675",
  "#fd79a8",
  "#fdcb6e",
  "#e17055",
  "#d63031",
  "#feca57",
  "#5f27cd",
  "#54a0ff",
  "#01a3a4",
];

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function App() {
  const [numPlayers, setNumPlayers] = useState('20');
  const [limitType, setLimitType] = useState('Top');
  const [rankType, setRankType] = useState('General');
  const [numMatches, setNumMatches] = useState('10');

  let data = {};

  let count = 0;
  let counter2 = 0;

  for (const match of ranks) {
    if (count == numMatches) {
      break;
    }
    for (const entity of match.rankOverTimeEntities) {
      counter2++;
      counter2%=colorScheme.length;
      if (!data[entity.alias]) {
        data[entity.alias] = {
          label: entity.alias,
          borderColor: colorScheme[counter2],
          data: []
        }
      }

      if (rankType === entity.gameFormatTFClass) {
        data[entity.alias].data.push({
          x: match.id,
          y: entity.gameFormatClassRank,
          matchNum: data[entity.alias].data.length + 1,
        });
      } else if (rankType === 'General') {
        data[entity.alias].data.push({
          x: match.id,
          y: entity.globalRank,
          matchNum: data[entity.alias].data.length + 1,
        });
      }
    }
    count++;
  }

  let finalData =
    limitType === "Top"
      ? Object.values(data)
          .sort((a, b) => b.data.length - a.data.length)
          .slice(0, numPlayers)
      : shuffle(Object.values(data)).slice(0, numPlayers);
  
  console.log(finalData);

  return (
    <div className="App">
      <div>
        <label>Number of Players</label>
        <input
          type="number"
          value={numPlayers}
          onChange={(e) => setNumPlayers(e.target.value)}
        />
        <label>Limit Type</label>
        <select
          value={limitType}
          onChange={(e) => setLimitType(e.target.value)}
        >
          <option>Top</option>
          <option>Random</option>
        </select>
        <label>Rank Type</label>
        <select value={rankType} onChange={(e) => setRankType(e.target.value)}>
          {rankTypes.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <label>Number of Matches</label>
        <input
          type="number"
          value={numMatches}
          onChange={(e) => setNumMatches(e.target.value)}
        />
      </div>
      <Line
        data={{
          labels: Array.from(Array((parseInt(numMatches) || 0) + 1).keys()),
          datasets: finalData,
        }}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem, data) {
                  return `${tooltipItem.dataset.label}: ${Math.round(100 * tooltipItem.parsed.y) / 100} #${tooltipItem.raw.matchNum}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}

export default App;
