import { useQuery } from '@tanstack/react-query';
import { BattleResponse } from '@/types/battle';
import { getBattles } from '@/actions/battle';

export const useBattles = () => {
  const { data } = useQuery<BattleResponse>({
    queryKey: ['battles'],
    queryFn: async () => getBattles(),
    refetchInterval: 5000,
  });

  console.log(data);
  const mbs = data?.mooner.map((battle) => ({ ...battle, category: 'mooner' })) ?? [];
  const dbs = data?.doomer.map((battle) => ({ ...battle, category: 'doomer' })) ?? [];
  const tbs = data?.trending.map((battle) => ({ ...battle, category: 'trending' })) ?? [];
  return {
    battles: [...mbs, ...dbs, ...tbs],
  };
};
