export const GainChart = ({ isGain, count }: { isGain: boolean; count: number }) => {
  return (
    <div className={'flex flex-col gap-[1px] w-[14px]'}>
      {Array.from(Array(count)).map((_, i) => (
        <div className={`w-[14px] h-[4px] / ${isGain ? 'bg-primary' : 'bg-danger'}`} key={i} />
      ))}
    </div>
  );
};
