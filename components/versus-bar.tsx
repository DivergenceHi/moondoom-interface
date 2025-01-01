export const VersusBar = ({ callAmount, putAmount }: { callAmount: bigint; putAmount: bigint }) => {
  const totalAmount = callAmount + putAmount;
  const callPercent = totalAmount > 0n ? (callAmount * 10000n) / totalAmount : 0n;
  const putPercent = totalAmount > 0n ? (putAmount * 10000n) / totalAmount : 0n;

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
