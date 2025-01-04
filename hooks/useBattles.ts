import { useQuery } from '@tanstack/react-query';
import { BattleResponse, BattleWithCategory } from '@/types/battle';
import { getBattles } from '@/actions/battle';
import { Address, parseEther } from 'viem';

export const useBattles = (): { loading: boolean; battles: BattleWithCategory[] } => {
  const { data, isLoading } = useQuery<BattleResponse>({
    queryKey: ['battles'],
    queryFn: async () => getBattles(),
    refetchInterval: 10000,
    staleTime: 20000,
  });

  const mbs =
    data?.mooner.map((battle) => ({
      id: battle.battle_info.battle as Address,
      sqrtPriceX96: BigInt(battle.battle_info.sqrt_price_x96),
      spearAddress: battle.battle_info.spear,
      shieldAddress: battle.battle_info.shield,
      currentPrice: battle.current_price,
      past7Days: battle.past_7days,
      bk: {
        collateral: battle.battle_info.bk.collateral,
        underlying: battle.battle_info.bk.underlying,
        expiry: BigInt(battle.battle_info.bk.expiries),
        expiries: BigInt(battle.battle_info.bk.expiries),
        strikeValue: parseEther(battle.battle_info.bk.strike_value),
      },
      category: 'mooner',
    })) ?? [];
  const dbs =
    data?.doomer.map((battle) => ({
      id: battle.battle_info.battle as Address,
      sqrtPriceX96: BigInt(battle.battle_info.sqrt_price_x96),
      spearAddress: battle.battle_info.spear,
      shieldAddress: battle.battle_info.shield,
      currentPrice: battle.current_price,
      past7Days: battle.past_7days,
      bk: {
        collateral: battle.battle_info.bk.collateral,
        underlying: battle.battle_info.bk.underlying,
        expiry: BigInt(battle.battle_info.bk.expiries),
        expiries: BigInt(battle.battle_info.bk.expiries),
        strikeValue: parseEther(battle.battle_info.bk.strike_value),
      },
      category: 'doomer',
    })) ?? [];
  const tbs =
    data?.trending.map((battle) => ({
      id: battle.battle_info.battle as Address,
      sqrtPriceX96: BigInt(battle.battle_info.sqrt_price_x96),
      spearAddress: battle.battle_info.spear,
      shieldAddress: battle.battle_info.shield,
      currentPrice: battle.current_price,
      past7Days: battle.past_7days,
      bk: {
        collateral: battle.battle_info.bk.collateral,
        underlying: battle.battle_info.bk.underlying,
        expiry: BigInt(battle.battle_info.bk.expiries),
        expiries: BigInt(battle.battle_info.bk.expiries),
        strikeValue: parseEther(battle.battle_info.bk.strike_value),
      },
      category: 'trending',
    })) ?? [];
  return {
    loading: isLoading,
    battles: [...mbs, ...dbs, ...tbs],
  };
};
