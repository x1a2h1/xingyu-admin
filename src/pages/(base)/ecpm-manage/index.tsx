import { useRequest } from '@sa/hooks';
import { useEffect, useState } from 'react';

import { fetchCreateECPM, fetchDeleteECPM, fetchGetECPMList } from '@/service/api';

import { ConfigCardList } from './modules/ConfigCardList.tsx';
import { ConfigDetail } from './modules/ConfigDetail.tsx';

const EcpmManage = () => {
  // 状态管理
  const [showDetail, setShowDetail] = useState(false);
  const [currentConfigId, setCurrentConfigId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // API请求
  const { data, loading, run } = useRequest(
    (params: { page?: number; pageSize?: number } = {}) => fetchGetECPMList(params),
    {
      defaultParams: [{ page: pagination.current, pageSize: pagination.pageSize }],
      onSuccess: result => {
        if (result) {
          setPagination(prev => ({
            ...prev,
            total: result.total || 0
          }));
        }
      }
    }
  );

  const configList = data?.list || [];

  // 获取配置列表数据
  const fetchConfigList = useCallback(
    (page = 1, pageSize = 10) => {
      run({ page, pageSize });
    },
    [run]
  );

  // 监听分页变化
  useEffect(() => {
    fetchConfigList(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize, fetchConfigList]);

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  // 处理删除配置
  const handleDelete = (id: number) => {
    fetchDeleteECPM(id)
      .then(() => {
        window.$message?.success('删除成功');
        fetchConfigList(pagination.current, pagination.pageSize);
      })
      .catch(() => {
        window.$message?.error('删除失败');
      });
  };

  // 处理添加新配置
  const handleAddConfig = () => {
    fetchCreateECPM()
      .then(() => {
        window.$message?.success('添加成功');
        fetchConfigList(1, pagination.pageSize); // 新增后跳转到第一页
      })
      .catch(() => {
        window.$message?.error('添加失败');
      });
  };

  // 处理查看配置详情
  const handleViewConfig = (id: number) => {
    setCurrentConfigId(id);
    setShowDetail(true);
  };

  // 处理返回列表
  const handleBackToList = () => {
    setShowDetail(false);
    setCurrentConfigId(null);
    fetchConfigList(pagination.current, pagination.pageSize);
  };

  // 获取当前选中的配置
  const currentConfig = configList.find(config => config.id === currentConfigId);

  if (showDetail && currentConfig) {
    return (
      <div className="p-4">
        <ConfigDetail
          config={currentConfig}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <ACard className="mb-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">eCPM配置管理</div>
          <AButton
            icon={<div className="i-carbon:add text-base" />}
            type="primary"
            onClick={handleAddConfig}
          >
            新增配置
          </AButton>
        </div>
      </ACard>

      <ConfigCardList
        configList={configList}
        loading={loading}
        onDelete={handleDelete}
        onView={handleViewConfig}
      />

      {configList.length > 0 && (
        <div className="mt-6 flex justify-center">
          <APagination
            hideOnSinglePage
            simple
            current={pagination.current}
            pageSize={pagination.pageSize}
            showSizeChanger={false}
            total={pagination.total}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default EcpmManage;
