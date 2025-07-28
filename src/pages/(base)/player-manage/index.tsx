import { useEffect, useState } from 'react';

import { fetchBanPlayer, fetchGetPlayerList, fetchUnbanPlayer } from '@/service/api';

import { PlayerTable } from './modules/PlayerTable';
import { SearchForm } from './modules/SearchForm';

const PlayerManage = () => {
  const [searchForm] = AForm.useForm();
  const [playerData, setPlayerData] = useState<Api.Player.Info[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 获取玩家列表
  const { loading, run: getPlayerList } = useRequest(fetchGetPlayerList, {
    onError: _err => {
      window.$message?.error('获取玩家列表失败，请稍后重试');
      setPlayerData([]);
    },
    onSuccess: res => {
      let playerListData: Api.Player.Info[] = [];
      try {
        if (res?.data?.list) {
          playerListData = Array.isArray(res.data.list) ? res.data.list : [];
        }
        setPagination(prev => ({
          ...prev,
          total: res?.data?.total || 0
        }));
      } catch {
        playerListData = [];
      }
      setPlayerData(playerListData);
    }
  });

  useEffect(() => {
    getPlayerList();
  }, [getPlayerList]);

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    const params = {
      ...values,
      page: pagination.current,
      page_size: pagination.pageSize
    };
    getPlayerList(params);
  };

  const handleReset = () => {
    searchForm.resetFields();
    getPlayerList();
  };

  // 封禁玩家
  const { loading: banLoading, run: banPlayer } = useRequest(fetchBanPlayer, {
    manual: true,
    onError: _err => {
      window.$message?.error('封禁玩家失败，请稍后重试');
    },
    onSuccess: () => {
      window.$message?.success('封禁玩家成功');
      getPlayerList();
    }
  });

  // 解封玩家
  const { loading: unbanLoading, run: unbanPlayer } = useRequest(fetchUnbanPlayer, {
    manual: true,
    onError: _err => {
      window.$message?.error('解封玩家失败，请稍后重试');
    },
    onSuccess: () => {
      window.$message?.success('解封玩家成功');
      getPlayerList();
    }
  });

  const handleBanPlayer = (player: Api.Player.Info, reason: string) => {
    banPlayer(player.uid, reason);
  };

  const handleUnbanPlayer = (player: Api.Player.Info) => {
    AModal.confirm({
      onOk: () => {
        unbanPlayer(player.uid);
      },
      title: `确认解封玩家: ${player.uid}?`
    });
  };

  const handleTableChange = (paginationParams: { current: number; pageSize: number }) => {
    setPagination(prev => ({
      ...prev,
      current: paginationParams.current,
      pageSize: paginationParams.pageSize
    }));

    const values = searchForm.getFieldsValue();
    const params = {
      ...values,
      page: paginationParams.current,
      page_size: paginationParams.pageSize
    };
    getPlayerList(params);
  };

  return (
    <div className="p-4">
      <ACard className="mb-4">
        <SearchForm
          form={searchForm}
          loading={loading}
          onReset={handleReset}
          onSearch={handleSearch}
        />
      </ACard>

      <ACard>
        <PlayerTable
          dataSource={playerData}
          loading={loading || banLoading || unbanLoading}
          pagination={pagination}
          onBanPlayer={handleBanPlayer}
          onChange={handleTableChange}
          onUnbanPlayer={handleUnbanPlayer}
        />
      </ACard>
    </div>
  );
};

export default PlayerManage;
