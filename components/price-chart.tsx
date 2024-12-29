import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  data: Array<{
    price: string;
    timestamp: number;
  }>;
}

export default function PriceChart({ data }: PriceChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString(),
      price: parseFloat(item.price),
    }));
  }, [data]);

  const minPrice = useMemo(() => Math.min(...chartData.map((d) => d.price)) * 0.995, [chartData]);

  const maxPrice = useMemo(() => Math.max(...chartData.map((d) => d.price)) * 1.005, [chartData]);

  return (
    <div className="w-full h-[400px] ">
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
          </defs>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
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
          {/*<Area*/}
          {/*  type="monotone"*/}
          {/*  dataKey="price"*/}
          {/*  stroke="none"*/}
          {/*  fill="url(#upperGradient)"*/}
          {/*  isAnimationActive={false}*/}
          {/*  baseLine={targetPrice}*/}
          {/*  baseValue={targetPrice}*/}
          {/*/>*/}
          {/*<Area*/}
          {/*  type="monotone"*/}
          {/*  dataKey="price"*/}
          {/*  stroke="none"*/}
          {/*  fill="url(#lowerGradient)"*/}
          {/*  isAnimationActive={false}*/}
          {/*  baseLine={targetPrice}*/}
          {/*  baseValue={targetPrice}*/}
          {/*/>*/}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
