import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function FeeData({ feePayments, isLoading }) {
  return (
    <div className="bg-white mt-3 lg:h-96 h-auto p-2 w-150 rounded-lg shadow">
      <p className="text-gray-700 font-semibold">Payments(per year)</p>
      <BarChart
        width={500}
        height={400}
        data={feePayments || []}
        margin={{
          top: 20,
          right: 65,
          // left: 1,
          bottom: 45,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="term" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="previous" stackId="a" fill="#8884d8" />
        <Bar dataKey="current" stackId="a" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}

export default FeeData;
