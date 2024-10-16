import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BudgetVsExpenditureChartProps {
  categories: {
    name: string;
    budget: number;
    expenditure: number;
  }[];
}

const BudgetVsExpenditureChart: React.FC<BudgetVsExpenditureChartProps> = ({
  categories,
}) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={categories}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="budget" fill="#8884d8" name="Budget" />
        <Bar dataKey="expenditure" fill="#82ca9d" name="Expenditure" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetVsExpenditureChart;
