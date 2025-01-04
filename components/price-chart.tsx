import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowFillIcon } from '@/components/icons/arrow-fill';
import { TargetIcon } from '@/components/icons/target';
import { calculatePriceChange } from '@/lib/display';
import clsx from 'clsx';

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

  const prices = chartData?.map((d) => d.price);
  const minPrice = useMemo(() => Math.min(...[...prices, parseFloat(targetPrice)]) * 0.95, [prices]);
  const maxPrice = useMemo(() => Math.max(...[...prices, parseFloat(targetPrice)]) * 1.05, [prices]);

  const sub = maxPrice - minPrice;

  const topHeight = (265 * (maxPrice - parseFloat(targetPrice))) / sub;
  const bottomHeight = 265 - topHeight - 5;

  const currentPrice = data?.[data.length - 1]?.price ?? '0';
  const currentTopHeight = (265 * (maxPrice - parseFloat(currentPrice))) / sub;
  const priceChange = calculatePriceChange(targetPrice, currentPrice);

  return (
    <div className="w-full h-[300px] relative">
      <div
        className={clsx(
          'absolute right-[65px] z-50 text-sm w-[300px] flex items-center px-4 py-1 font-roboto text-white font-semibold gap-2',
          {
            'bg-primary': !priceChange.isNegative,
            'bg-[#FF626E]': priceChange.isNegative,
          },
        )}
        style={{
          top: `${topHeight - 8}px`,
        }}
      >
        <TargetIcon />
        <div>Target Price</div>
        <div className={'ml-auto flex items-center'}>
          ({priceChange.formatted})&nbsp;&nbsp;{targetPrice}
        </div>
      </div>
      <div
        className={clsx('text-xs inline-block px-2 text-white font-bold font-roboto absolute right-0', {
          'bg-primary': priceChange.isPositive,
          'bg-danger': priceChange.isNegative,
        })}
        style={{
          top: `${currentTopHeight}px`,
        }}
      >
        {parseFloat(currentPrice).toFixed(2)}
      </div>
      <div
        className={`bg-primary bg-opacity-20 absolute left-1 right-[65px] top-[5px]`}
        style={{ height: `${topHeight}px` }}
      >
        <div className={'text-primary font-semibold text-sm flex items-center gap-1 absolute left-8 bottom-2'}>
          <ArrowFillIcon />
          Up wins
        </div>
      </div>
      <div
        className={'bg-danger bg-opacity-10 absolute left-1 right-[65px] border-t-2 border-t-danger'}
        style={{
          top: `${topHeight + 5}px`,
          height: `${bottomHeight}px`,
        }}
      >
        <div className={'text-danger font-semibold text-sm flex items-center gap-1 absolute left-28 top-2'}>
          <ArrowFillIcon className={'rotate-180 '} />
          Down wins
        </div>
      </div>
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
