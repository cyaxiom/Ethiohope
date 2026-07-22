import React from 'react';

interface ChartData {
  day: string;
  completed: number;
  inProgress: number;
}

interface ProgressChartProps {
  data: ChartData[];
  className?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, className }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.completed, d.inProgress]));
  
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col h-full ${className}`}>
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center justify-between">
        Your exam progress
        <span className="text-xs font-medium text-gray-400 font-sans tracking-wider border border-gray-100 rounded-lg p-1.5 hover:bg-gray-50 cursor-pointer">
          📈 DETAILS
        </span>
      </h2>
      
      <div className="flex-1 flex flex-col justify-end relative h-64 mt-4">
        {/* Y-axis Labels */}
        <div className="absolute left-[-1.5rem] top-0 bottom-8 flex flex-col justify-between text-[10px] font-bold text-gray-400 tracking-tighter">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart Bars */}
        <div className="flex items-end justify-between gap-4 h-full pl-6 border-b border-gray-100 pb-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer h-full">
              <div className="relative h-full flex flex-row items-end gap-1.5 w-12 justify-center pb-2">
                <div 
                  className="w-3.5 bg-blue-500 rounded-t-xl group-hover:bg-blue-600 transition-all duration-300 drop-shadow-sm" 
                  style={{ height: `${(item.completed / maxValue) * 100}%` }}
                />
                <div 
                  className="w-3.5 bg-[#add2ed] rounded-t-xl group-hover:bg-[#99c4e2] transition-all duration-300 opacity-60" 
                  style={{ height: `${(item.inProgress / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-gray-400">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm" />
          <span className="text-xs font-bold text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#add2ed] opacity-60" />
          <span className="text-xs font-bold text-gray-600">In progress</span>
        </div>
      </div>
      
       <button className="mt-6 text-blue-500 text-sm font-bold hover:text-blue-600 transition-all text-center w-full py-2 hover:bg-blue-50 rounded-xl">
        View All
      </button>
    </div>
  );
};

export default ProgressChart;
