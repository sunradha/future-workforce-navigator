
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  ArrowUp, 
  ArrowDown,
  Layers
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  type?: 'default' | 'increase' | 'decrease';
  icon?: 'trend' | 'chart' | 'layers' | 'none';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  type = 'default',
  icon = 'trend',
  color = 'blue'
}) => {
  const getIcon = () => {
    if (icon === 'trend') {
      return type === 'increase' ? <TrendingUp size={20} /> : <TrendingDown size={20} />;
    } else if (icon === 'chart') {
      return <BarChart size={20} />;
    } else if (icon === 'layers') {
      return <Layers size={20} />;
    }
    return null;
  };

  const getColorClass = () => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-600';
      case 'red': return 'bg-red-100 text-red-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'blue':
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const getChangeColor = () => {
    if (type === 'increase') return 'text-green-600';
    if (type === 'decrease') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="stat-card flex justify-between items-center">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        
        {change !== undefined && (
          <div className={`flex items-center mt-1 ${getChangeColor()}`}>
            {type === 'increase' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="text-xs ml-1">{Math.abs(change)}% from previous</span>
          </div>
        )}
      </div>
      
      {icon !== 'none' && (
        <div className={`p-3 rounded-full ${getColorClass()}`}>
          {getIcon()}
        </div>
      )}
    </div>
  );
};

export default StatCard;
