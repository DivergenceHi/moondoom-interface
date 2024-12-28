import { useQuery } from '@tanstack/react-query';
import { BattleResponse } from '@/types/battle';
import { getBattles } from '@/actions/battle';
import { parseEther } from 'viem';

export const useBattles = () => {
  const { data, isLoading } = useQuery<BattleResponse>({
    queryKey: ['battles'],
    queryFn: async () => getBattles(),
    refetchInterval: 5000,
  });

  const mbs =
    data?.mooner.map((battle) => ({
      ...battle,
      bk: {
        collateral: battle.battle_info.bk.collateral,
        underlying: battle.battle_info.bk.underlying,
        expiries: BigInt(battle.battle_info.bk.expiries),
        strikeValue: parseEther(battle.battle_info.bk.strike_value),
      },
      category: 'mooner',
    })) ?? [];
  const dbs =
    data?.doomer.map((battle) => ({
      ...battle,
      bk: {
        collateral: battle.battle_info.bk.collateral,
        underlying: battle.battle_info.bk.underlying,
        expiries: BigInt(battle.battle_info.bk.expiries),
        strikeValue: parseEther(battle.battle_info.bk.strike_value),
      },
      category: 'doomer',
    })) ?? [];
  const tbs =
    data?.trending.map((battle) => ({
      ...battle,
      bk: {
        collateral: battle.battle_info.bk.collateral,
        underlying: battle.battle_info.bk.underlying,
        expiries: BigInt(battle.battle_info.bk.expiries),
        strikeValue: parseEther(battle.battle_info.bk.strike_value),
      },
      category: 'trending',
    })) ?? [];
  return {
    isLoading,
    battles: [...mbs, ...dbs, ...tbs],
  };
};
