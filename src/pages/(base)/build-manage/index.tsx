import { useRequest } from 'ahooks';
import { useMemo, useState } from 'react';

import {
  fetchDeleteAppChan,
  fetchGetAppChanList,
  fetchGetAppList,
  fetchGetChannelList,
  fetchPostAppChan
} from '@/service/api';

import { CreateModal } from './components/CreateModal';
import { ChannelTable } from './modules/ChannelTable';

// 重构后的管理类，直接集成在页面中
interface TableQueryParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

interface ChannelFormData {
  app_id: number;
  channel_id: number;
  name: string;
  remarks: string;
}

const BuildManage = () => {
  const [searchForm] = AForm.useForm();
  const [searchParams, setSearchParams] = useState<TableQueryParams>({ keyword: '', page: 1, pageSize: 10 });
  const [modalVisible, setModalVisible] = useState(false);

  // 应用缓存数据
  const { data: appData, loading: appLoading } = useRequest(fetchGetAppList, {
    defaultParams: [{ pageSize: 100 }],
    manual: false,
    staleTime: 5 * 60 * 1000
  });

  // 渠道关联列表
  const {
    data: channelData,
    loading: channelLoading,
    run: refreshChannelList
  } = useRequest(fetchGetAppChanList, {
    defaultParams: [searchParams],
    refreshDeps: [searchParams]
  });

  // 渠道列表
  const { data: channelListData } = useRequest(fetchGetChannelList, {
    defaultParams: [{ pageSize: 100 }],
    manual: false
  });

  // 删除操作
  const { loading: deleteLoading, run: handleDelete } = useRequest(fetchDeleteAppChan, {
    manual: true,
    onError: () => window.$message?.error('删除失败'),
    onSuccess: () => {
      window.$message?.success('删除成功');
      refreshChannelList();
    }
  });

  // 新增操作
  const { loading: submitLoading, run: handleCreate } = useRequest(fetchPostAppChan, {
    manual: true,
    onError: () => window.$message?.error('新增失败'),
    onSuccess: () => {
      window.$message?.success('新增成功');
      setModalVisible(false);
      refreshChannelList();
    }
  });

  const confirmDelete = (id: number | string) => handleDelete(String(id));

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    setSearchParams(prev => ({ ...prev, keyword: values.keyword || '', page: 1 }));
  };

  const handleReset = () => {
    searchForm.resetFields();
    setSearchParams({ page: 1, pageSize: 10 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setSearchParams(prev => ({ ...prev, page, pageSize }));
  };

  const handleSubmit = async (values: ChannelFormData) => {
    await handleCreate(values);
  };

  const appOptions = useMemo(
    () =>
      appData?.data?.list?.map(app => ({
        label: app.app_name,
        value: app.id
      })) || [],
    [appData]
  );

  const channelOptions = useMemo(
    () =>
      channelListData?.data?.list?.map(channel => ({
        label: channel.name,
        value: channel.id
      })) || [],
    [channelListData]
  );

  const tableData = channelData?.data?.list || [];
  const total = channelData?.data?.total || 0;
  const currentPage = searchParams.page || 1;
  const pageSize = searchParams.pageSize || 10;
  const pagination = {
    current: currentPage,
    pageSize,
    total
  };

  return (
    <div className="h-full flex flex-col gap-4 bg-gray-50 p-4">
      {/* 页面标题区域 */}
      <div>
        <h1 className="mb-2 flex items-center gap-2 text-2xl text-gray-900 font-bold">
          <div className="i-carbon:connection-signal text-blue-500" />
          打包管理
        </h1>
        <div className="max-w-3xl rounded-lg bg-gray-100 p-3 text-sm text-gray-500 leading-relaxed">
          管理应用与渠道的关联关系，用于控制应用打包时的参数配置。渠道决定了登录方式等开关参数，应用则包含基础包名、主体公司等信息。
          请确保每个应用与渠道的关联具有明确的业务含义和命名规范。
        </div>
      </div>

      {/* 搜索表单 - 紧凑灵活布局 */}
      <ACard className="border-0 rounded-lg shadow-sm">
        <AForm
          form={searchForm}
          layout="horizontal"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <AForm.Item
                className="mb-0"
                label="搜索关键词"
                name="keyword"
              >
                <AInput
                  allowClear
                  placeholder="应用名称或备注"
                  prefix={<div className="i-carbon:search text-gray-300" />}
                />
              </AForm.Item>
            </div>
            <div className="flex items-end gap-2">
              <AButton
                icon={<div className="i-carbon:search" />}
                type="primary"
                onClick={handleSearch}
              >
                搜索
              </AButton>
              <AButton
                icon={<div className="i-carbon:reset" />}
                onClick={handleReset}
              >
                重置
              </AButton>
              <AButton
                ghost
                icon={<div className="i-carbon:add" />}
                loading={submitLoading}
                type="primary"
                onClick={() => setModalVisible(true)}
              >
                新增关联
              </AButton>
            </div>
          </div>
        </AForm>
      </ACard>

      {/* 数据表格区域 - 卡片悬浮效果 */}
      <ACard className="flex flex-col flex-1 overflow-hidden border-0 rounded-lg shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <div className="text-lg text-gray-900 font-semibold">关联列表</div>
            <div className="text-sm text-gray-500">共 {total} 条记录</div>
          </div>
          <div className="text-sm text-gray-500">
            第 {Math.min((currentPage - 1) * pageSize + 1, total)} - {Math.min(currentPage * pageSize, total)} 条
          </div>
        </div>

        <div className="m-0 flex-1 overflow-hidden">
          <ChannelTable
            data={tableData}
            loading={channelLoading || deleteLoading || appLoading}
            pagination={pagination}
            onDelete={confirmDelete}
            onEdit={() => {}} // 由于不再需要编辑功能，保留空函数以满足接口
            onPageChange={handlePageChange}
          />
        </div>
      </ACard>

      {/* 新增模态框 */}
      <CreateModal
        appData={appData?.data?.list} // 传递Api.Application.Info[] 类型
        appOptions={appOptions}
        channelOptions={channelOptions}
        loading={submitLoading}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRefresh={refreshChannelList}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BuildManage;
