import React from 'react'
import salesData from '../data/salesData.json';
import { LineChart,  Line, XAxis, YAxis,  CartesianGrid, Tooltip, Legend } from 'recharts' ;
function SalesChart() {
  return (
    <div>
      <h2>Sales Overview</h2>
      <LineChart width={700} height={400} data={salesData.monthlySales}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="basis" dataKey="revenue" stroke="#8884d8" />
        <Line type="basis" dataKey="orders" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}

export default SalesChart;
