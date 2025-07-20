import { useState } from 'react';

import {
  fetchCreateEntifyConfig,
  fetchDeleteEntify,
  fetchUpdateEntifyConfig,
  fetchUpdateOrCreateAlipayConfig
} from '@/service/api/entity';

import { AlipayConfigModal } from './AlipayConfigModal';
import { PlatformConfigModal } from './PlatformConfigModal';
import type { EntityItem } from './types';

interface EntityTableProps {
  readonly data?: Api.Entity.List;
  readonly loading?: boolean;
  readonly onEdit: (record: EntityItem) => void;
  readonly onRefresh: () => void;
}

export function EntityTable({ data, loading = false, onEdit, onRefresh }: EntityTableProps) {
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({});
  const [configLoading, setConfigLoading] = useState(false);

  // 平台配置模态框状态
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [configModalMode, setConfigModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [currentPlatform, setCurrentPlatform] = useState<'adnetqq' | 'csj' | 'kwai' | 'taku'>('csj');
  const [currentPlatformData, setCurrentPlatformData] = useState<any>(null);
  const [currentEntity, setCurrentEntity] = useState<EntityItem | null>(null);

  // 支付宝配置模态框状态
  const [alipayModalVisible, setAlipayModalVisible] = useState(false);
  const [alipayModalMode, setAlipayModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [alipayConfigData, setAlipayConfigData] = useState<Api.Entity.AlipayConfig | undefined>(undefined);

  const handleDelete = async (id: number | string) => {
    try {
      setDeleteLoading(prev => ({ ...prev, [id]: true }));
      await fetchDeleteEntify(String(id));
      window?.$message?.success('删除公司成功');
      onRefresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除公司失败';
      window?.$message?.error(errorMessage);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // 处理配置平台
  const handleConfigure = (platform: 'adnetqq' | 'alipay' | 'csj' | 'kwai' | 'taku', record: EntityItem) => {
    setCurrentEntity(record);

    if (platform === 'alipay') {
      setAlipayModalMode('create');
      setAlipayConfigData(undefined);
      setAlipayModalVisible(true);
    } else {
      setCurrentPlatform(platform as 'adnetqq' | 'csj' | 'kwai' | 'taku');
      setConfigModalMode('create');
      setCurrentPlatformData(null);
      setConfigModalVisible(true);
    }
  };

  // 处理编辑配置
  const handleEditConfig = (
    platform: 'adnetqq' | 'alipay' | 'csj' | 'kwai' | 'taku',
    configData: any,
    record: EntityItem
  ) => {
    setCurrentEntity(record);

    if (platform === 'alipay') {
      setAlipayModalMode('edit');
      setAlipayConfigData(configData as Api.Entity.AlipayConfig);
      setAlipayModalVisible(true);
    } else {
      setCurrentPlatform(platform as 'adnetqq' | 'csj' | 'kwai' | 'taku');
      setConfigModalMode('edit');
      setCurrentPlatformData(configData);
      setConfigModalVisible(true);
    }
  };

  // 配置状态渲染函数
  const renderConfigStatus = (platform: 'adnetqq' | 'alipay' | 'csj' | 'kwai' | 'taku', record: EntityItem) => {
    // 根据平台名称获取配置数据
    const configData = record[platform];

    if (!configData) {
      return (
        <AButton
          className="h-8 flex items-center justify-center border-blue-400 rounded-md text-xs transition-all hover:border-blue-500 hover:text-blue-500"
          icon={<div className="i-carbon:add-alt text-base" />}
          size="small"
          type="dashed"
          onClick={() => handleConfigure(platform, record)}
        >
          配置
        </AButton>
      );
    }

    return (
      <AButton
        ghost
        className="h-8 flex items-center justify-center border-blue-400 rounded-md text-xs transition-colors hover:border-blue-600 hover:text-blue-600"
        icon={<div className="i-carbon:edit text-sm" />}
        size="small"
        type="primary"
        onClick={() => handleEditConfig(platform, configData, record)}
      >
        编辑
      </AButton>
    );
  };

  // 处理配置提交
  const handleConfigSubmit = async (values: any) => {
    if (!currentEntity) return;

    try {
      setConfigLoading(true);

      if (configModalMode === 'create') {
        // 其他平台使用通用API - 创建
        await fetchCreateEntifyConfig(String(currentEntity.id), currentPlatform, values);
        window?.$message?.success('创建平台配置成功');
      } else {
        // 其他平台使用通用API - 更新
        await fetchUpdateEntifyConfig(String(currentEntity.id), currentPlatform, values);
        window?.$message?.success('更新平台配置成功');
      }

      setConfigModalVisible(false);
      onRefresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '配置平台失败';
      window?.$message?.error(errorMessage);
    } finally {
      setConfigLoading(false);
    }
  };

  // 处理支付宝配置提交
  const handleAlipaySubmit = async (values: any) => {
    if (!currentEntity) return;

    try {
      setConfigLoading(true);
      await fetchUpdateOrCreateAlipayConfig(currentEntity.id, values);
      window?.$message?.success(alipayModalMode === 'create' ? '配置支付宝成功' : '更新支付宝配置成功');
      setAlipayModalVisible(false);
      onRefresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '配置支付宝失败';
      window?.$message?.error(errorMessage);
    } finally {
      setConfigLoading(false);
    }
  };

  const columns = [
    {
      dataIndex: 'id',
      key: 'id',
      title: 'ID',
      width: 60
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: '公司名称'
    },
    {
      dataIndex: 'domain',
      key: 'domain',
      title: '域名'
    },
    {
      align: 'center' as const,
      key: 'csj',
      render: (_: any, record: EntityItem) => renderConfigStatus('csj', record),
      title: '穿山甲',
      width: 100
    },
    {
      align: 'center' as const,
      key: 'taku',
      render: (_: any, record: EntityItem) => renderConfigStatus('taku', record),
      title: 'Taku',
      width: 100
    },
    {
      align: 'center' as const,
      key: 'kwai',
      render: (_: any, record: EntityItem) => renderConfigStatus('kwai', record),
      title: '快手',
      width: 100
    },
    {
      align: 'center' as const,
      key: 'adnetqq',
      render: (_: any, record: EntityItem) => renderConfigStatus('adnetqq', record),
      title: '优量汇',
      width: 100
    },
    {
      align: 'center' as const,
      key: 'alipay',
      render: (_: any, record: EntityItem) => renderConfigStatus('alipay', record),
      title: '支付宝',
      width: 100
    },
    {
      dataIndex: 'create_time',
      key: 'create_time',
      title: '创建时间',
      width: 240
    },
    {
      fixed: 'right' as const,
      key: 'action',
      render: (_: any, record: EntityItem) => (
        <ASpace size="small">
          <AButton
            className="rounded-md"
            icon={<div className="i-carbon:edit" />}
            size="small"
            type="primary"
            onClick={() => onEdit(record)}
          >
            编辑
          </AButton>
          <APopconfirm
            title="确定删除此公司吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <AButton
              danger
              className="rounded-md"
              icon={<div className="i-carbon:trash-can" />}
              loading={deleteLoading[record.id]}
              size="small"
              type="primary"
            >
              删除
            </AButton>
          </APopconfirm>
        </ASpace>
      ),
      title: '操作',
      width: 180
    }
  ];

  return (
    <>
      <ACard>
        <ATable
          columns={columns}
          dataSource={data?.list}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
            total: data?.total || 0
          }}
        />
      </ACard>

      {currentEntity && (
        <>
          <PlatformConfigModal
            configData={currentPlatformData}
            entityId={Number(currentEntity.id)}
            isView={configModalMode === 'view'}
            loading={configLoading}
            platformType={currentPlatform}
            visible={configModalVisible}
            onClose={() => setConfigModalVisible(false)}
            onSubmit={handleConfigSubmit}
          />
          <AlipayConfigModal
            configData={alipayConfigData}
            entityId={Number(currentEntity.id)}
            isView={alipayModalMode === 'view'}
            loading={configLoading}
            visible={alipayModalVisible}
            onClose={() => setAlipayModalVisible(false)}
            onSubmit={handleAlipaySubmit}
          />
        </>
      )}
    </>
  );
}
