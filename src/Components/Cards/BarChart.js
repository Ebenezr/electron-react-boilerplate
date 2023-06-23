import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';


const data = [
    {
      name: 'Grade 1',
      Boys: 4000,
      Girls: 2400,
    },
    {
      name: 'Grade 2',
      Boys: 3000,
      Girls: 1398,
    },
    {
      name: 'Grade 3',
      Boys: 2000,
      Girls: 8,
    },
    {
      name: 'Grade 4',
      Boys: 2780,
      Girls: 3908,
    },
    {
      name: 'Grade 5',
      Boys: 18,
      Girls: 4800,
    },
    {
      name: 'Grade 6',
      Boys: 2390,
      Girls: 3800,
    },
    {
      name: 'Grade 7',
      Boys: 3490,
      Girls: 4300,
    },
    {
      name: 'Grade 8',
      Boys: 3490,
      Girls: 400,
    },
  ];
  
  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 10;
  
    return (
      <g>
        <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
        <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">
          {value.split(' ')[1]}
        </text>
      </g>
    );
  };

 function Chart (){

    return (

        <BarChart
          width={500}
          height={450}
          data={data}
          margin={{
            top: 15,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Boys" fill="#8884d8" minPointSize={5}>
            <LabelList dataKey="name" content={renderCustomizedLabel} />
          </Bar>
          <Bar dataKey="Girls" fill="#82ca9d" minPointSize={10} />
        </BarChart>
    )

 }

 export default Chart;
