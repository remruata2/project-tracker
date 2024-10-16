import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface Subcategory {
  name: string;
  amount: number;
}

interface Category {
  name: string;
  subcategories: Subcategory[];
}

interface BudgetPieChartProps {
  categories: Category[];
}

const COLORS = [
  '#F44336', // Red
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#FF5722', // Deep Orange
  '#03A9F4', // Light Blue
  '#8BC34A', // Light Green
  '#E91E63', // Pink
  '#009688', // Teal
  '#673AB7', // Deep Purple
  '#FF9800', // Orange
  '#00BCD4', // Cyan
  '#3F51B5', // Indigo
  '#CDDC39', // Lime
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

const BudgetPieChart: React.FC<BudgetPieChartProps> = ({ categories }) => {
  const data = categories.map((category) => ({
    name: category.name,
    value: category.subcategories.reduce((sum, sub) => sum + sub.amount, 0),
  }));

  return (
    <ResponsiveContainer width="100%" aspect={1}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius="30%"
          outerRadius="60%"
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => {
            const percentValue = (percent * 100).toFixed(0);
            return +percentValue > 5 ? `${name} ${percentValue}%` : '';
          }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                index < COLORS.length ? COLORS[index] : COLORS[data.length - 1]
              }
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) =>
            `Rs.${typeof value === 'number' ? value.toFixed(2) : value}`
          }
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: '12px', marginTop: '10px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BudgetPieChart;
