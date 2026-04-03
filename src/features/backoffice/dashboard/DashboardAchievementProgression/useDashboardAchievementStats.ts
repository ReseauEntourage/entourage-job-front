import { useEffect, useState } from 'react';
import { Api } from 'src/api';

interface AchievementStats {
  responseRate: number | null;
  totalConversationWithMirrorRoleCount: number | null;
}

export function useDashboardAchievementStats() {
  const [stats, setStats] = useState<AchievementStats>({
    responseRate: null,
    totalConversationWithMirrorRoleCount: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Api.getAuthCurrentStats().then(({ data }) => {
      setStats({
        responseRate: data.responseRate,
        totalConversationWithMirrorRoleCount:
          data.totalConversationWithMirrorRoleCount,
      });
      setIsLoading(false);
    });
  }, []);

  return { stats, isLoading };
}
