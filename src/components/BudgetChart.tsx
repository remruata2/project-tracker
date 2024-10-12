import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface Subcategory {
  name: string;
  amount: number;
}

interface Category {
  name: string;
  subcategories: Subcategory[];
}

interface BudgetPieChartProps {
  projectId: string;
}

const COLORS = [
  "#F44336", // Red
  "#2196F3", // Blue
  "#4CAF50", // Green
  "#FFC107", // Amber
  "#9C27B0", // Purple
  "#FF5722", // Deep Orange
  "#03A9F4", // Light Blue
  "#8BC34A", // Light Green
  "#E91E63", // Pink
  "#009688", // Teal
  "#673AB7", // Deep Purple
  "#FF9800", // Orange
  "#00BCD4", // Cyan
  "#3F51B5", // Indigo
  "#CDDC39", // Lime
  "#795548", // Brown
  "#607D8B", // Blue Grey
];

const BudgetPieChart: React.FC<BudgetPieChartProps> = ({ projectId }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories?projectId=${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [projectId]);

  const data = categories.map((category) => ({
    name: category.name,
    value: category.subcategories.reduce((sum, sub) => sum + sub.amount, 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={100}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
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
        <Tooltip formatter={(value) => `Rs.${value.toFixed(2)}`} />
        <Legend wrapperStyle={{ top: "400px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BudgetPieChart;
