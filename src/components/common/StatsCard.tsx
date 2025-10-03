import type { StatsCardProps } from "../../types/components-types";

export const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          <span
            className={`inline-block mt-2 text-xs font-semibold ${
              change.startsWith("+") ? "text-green-600" : "text-red-600"
            }`}
          >
            {change} from last month
          </span>
        </div>
        <div className={`${color} p-4 rounded-xl`}>
          <Icon className="text-2xl text-white" />
        </div>
      </div>
    </div>
  );
};
