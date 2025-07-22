import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useEffect, useState } from 'react';

import {
  fetchDeleteChannel,
  fetchGetChannelList,
  fetchPostChannel,
  fetchPutChannel,
  fetchPutChannelConfig
} from '@/service/api';

import ChannelModal from './modules/ChannelModal';
import ConfigModal from './modules/ConfigModal';
import SearchForm from './modules/SearchForm';

const ChannelManage = () => {
  const {
    data: resp,
    loading,
    run: getList
  } = useRequest(fetchGetChannelList, {
    manual: true
  });
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [submitting, setSubmitting] = useState(false); // 添加提交状态

  const [editingChannel, setEditingChannel] = useState<Api.Channel.Info | null>(null);
  const [modalVisible, { setFalse: hideModal, setTrue: showModal }] = useBoolean(false);
  const [configModalVisible, { setFalse: hideConfigModal, setTrue: showConfigModal }] = useBoolean(false);
  const [configChannel, setConfigChannel] = useState<Api.Channel.Info | null>(null);

  const init = useCallback(() => {
    getList({
      keyword: searchKeyword,
      page: currentPage,
      pageSize
    });
  }, [getList, searchKeyword, currentPage, pageSize]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (resp?.data?.total !== undefined) {
      setTotal(resp.data.total);
    }
  }, [resp]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setEditingChannel(null);
    showModal();
  };

  const handleEdit = (record: Api.Channel.Info) => {
    setEditingChannel(record);
    showModal();
  };

  const handleDelete = async (id: number) => {
    AModal.confirm({
      content: '确定要删除该渠道吗？删除后不可恢复。',
      onOk: async () => {
        try {
          await fetchDeleteChannel(id.toString());
          window.$message?.success('删除渠道成功');
          init(); // 刷新列表
        } catch (error: any) {
          window.$message?.error(`删除失败: ${error.message || '未知错误'}`);
        }
      },
      title: '确认删除'
    });
  };

  const handleSave = async (values: Record<'name' | 'remarks', string>, isEdit: boolean) => {
    try {
      setSubmitting(true);

      if (isEdit && editingChannel) {
        // 更新渠道
        await fetchPutChannel(editingChannel.id.toString(), values);
        window.$message?.success('更新渠道成功');
      } else {
        // 新增渠道
        await fetchPostChannel(values);
        window.$message?.success('新增渠道成功');
      }

      hideModal();
      init(); // 刷新列表
    } catch (error: any) {
      window.$message?.error(`${isEdit ? '更新' : '新增'}失败: ${error.message || '未知错误'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfig = (record: Api.Channel.Info) => {
    setConfigChannel(record);
    showConfigModal();
  };

  const handleConfigSave = async (values: Api.Channel.Options) => {
    try {
      setSubmitting(true);
      if (configChannel) {
        await fetchPutChannelConfig(configChannel.id.toString(), values);
        window.$message?.success('配置更新成功');
        hideConfigModal();
        init(); // 刷新列表
      }
    } catch (error: any) {
      window.$message?.error(`配置更新失败: ${error.message || '未知错误'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const columns = [
    { dataIndex: 'id', key: 'id', title: '序号', width: 80 },
    { dataIndex: 'name', key: 'name', title: '渠道名称' },
    { dataIndex: 'remarks', key: 'remarks', title: '备注' },
    {
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text: string) => new Date(text).toLocaleString(),
      title: '创建时间'
    },
    {
      dataIndex: 'creator',
      key: 'creator',
      render: (creator: Api.User.Info) => creator?.nickname || '-',
      title: '创建人'
    },
    {
      key: 'action',
      render: (_: any, record: Api.Channel.Info) => (
        <ASpace>
          <AButton
            type="link"
            onClick={() => handleEdit(record)}
          >
            <div className="i-carbon-edit mr-1" />
            编辑
          </AButton>
          <AButton
            type="link"
            onClick={() => handleConfig(record)}
          >
            <div className="i-carbon-settings mr-1" />
            配置项
          </AButton>
          <AButton
            danger
            type="link"
            onClick={() => handleDelete(record.id)}
          >
            <div className="i-carbon-trash-can mr-1" />
            删除
          </AButton>
        </ASpace>
      ),
      title: '操作',
      width: 280
    }
  ];

  return (
    <div className="p-4">
      <ACard className="mb-4">
        <SearchForm
          loading={loading}
          onAdd={handleAdd}
          onSearch={handleSearch}
        />
      </ACard>
      <ACard>
        <ATable
          columns={columns}
          dataSource={resp?.data?.list}
          loading={loading}
          rowKey="id"
          pagination={{
            current: currentPage,
            onChange: handlePageChange,
            pageSize,
            showSizeChanger: true,
            showTotal: totalCount => `共 ${totalCount} 条记录`,
            total
          }}
        />
      </ACard>
      <ChannelModal
        channel={editingChannel}
        loading={submitting}
        visible={modalVisible}
        onCancel={hideModal}
        onSave={handleSave}
      />
      <ConfigModal
        channel={configChannel}
        loading={submitting}
        visible={configModalVisible}
        onCancel={hideConfigModal}
        onSave={handleConfigSave}
      />
    </div>
  );
};

export default ChannelManage;
