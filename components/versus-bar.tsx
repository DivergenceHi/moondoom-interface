export const VersusBar = ({ callAmount, putAmount }: { callAmount: bigint; putAmount: bigint }) => {
  const totalAmount = callAmount + putAmount;
  const callPercent = (callAmount * 10000n) / totalAmount;
  const putPercent = (putAmount * 10000n) / totalAmount;

  return (
    <div className={'border border-black h-3 w-full  rounded-full flex-between'}>
      <div
        className={'rounded-l-full bg-dark-primary h-[10px] border-r border-r-black'}
        style={{
          width: `${Number(callPercent) / 100}%`,
        }}
      />

      <div
        className={'rounded-r-full bg-dark-danger h-[10px]'}
        style={{
          width: `${Number(putPercent) / 100}%`,
        }}
      />
    </div>
  );
};
