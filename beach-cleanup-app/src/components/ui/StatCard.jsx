import Card from './Card';

/**
 * StatCard component for displaying statistics
 * @param {Object} props
 * @param {string} props.title - Stat title
 * @param {string|number} props.value - Stat value
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} [props.color='ocean'] - Color theme
 * @param {string} [props.trend] - Trend indicator (optional)
 * @param {string} [props.className] - Additional CSS classes
 */
const StatCard = ({
  title,
  value,
  icon,
  color = 'ocean',
  trend,
  className = '',
}) => {
  const colorStyles = {
    ocean: 'border-ocean-500 text-ocean-500',
    green: 'border-green-500 text-green-500',
    blue: 'border-blue-500 text-blue-500',
    orange: 'border-orange-500 text-orange-500',
    purple: 'border-purple-500 text-purple-500',
    red: 'border-red-500 text-red-500',
  };

  return (
    <Card className={`p-6 border-l-4 ${colorStyles[color]} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={`h-12 w-12 ${colorStyles[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
