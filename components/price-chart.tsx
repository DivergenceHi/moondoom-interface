import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  targetPrice: string;
  data: Array<{
    price: string;
    timestamp: number;
  }>;
}

export default function PriceChart({ data, targetPrice }: PriceChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString(),
      price: parseFloat(item.price),
    }));
  }, [data]);

  const minPrice = useMemo(() => Math.min(...chartData.map((d) => d.price)) * 0.995, [chartData]);

  const maxPrice = useMemo(() => Math.max(...chartData.map((d) => d.price)) * 1.005, [chartData]);

  return (
    <div className="w-full h-[400px] relative">
      <div
        className={
          'absolute right-[65px] bg-[#FF626E] z-50 top-[185px] text-sm w-[300px] flex items-center justify-between px-4 py-1 font-roboto text-white font-semibold'
        }
      >
        <div>Target Price</div>
        <div>{targetPrice}</div>
      </div>
      <div className={'bg-primary bg-opacity-50 h-[200px] absolute left-1 right-[65px]'} />
      <div
        className={
          'bg-danger bg-opacity-20 h-[165px] absolute left-1 right-[65px] top-[200px] border-t-4 border-t-danger'
        }
      />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="upperGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="lowerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="colorLower" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            interval="preserveStartEnd"
            minTickGap={50}
            tick={{ fontSize: 11, fill: '#999' }}
            tickMargin={20}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tickFormatter={(value) => value.toFixed(2)}
            orientation="right"
            tick={{ fontSize: 11, fill: '#999' }}
            tickMargin={10}
          />
          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']} />
          <Area type="monotone" dataKey="price" stroke="#8884d8" fill="url(#priceGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
