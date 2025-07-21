import { useRequest } from 'ahooks';
import { Card, Form, message } from 'antd';
import { useEffect, useState } from 'react';

import { fetchGetWithdrawList, fetchPostWithdrawApprove } from '@/service/api';

import { ApprovalModal } from './modules/ApprovalModal';
import { DetailModal } from './modules/DetailModal';
import { SearchForm } from './modules/SearchForm';
import { WithdrawalTable } from './modules/WithdrawalTable';
import type { WithdrawalSearchParams } from './modules/types';

const WithdrawApproval = () => {
  const [searchForm] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState<Api.Withdraw.Info | null>(null);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [approveLoadingId, setApproveLoadingId] = useState<number | null>(null);

  const [searchParams, setSearchParams] = useState<WithdrawalSearchParams>({
    page: 1,
    page_size: 10
  });

  const {
    data: response,
    loading,
    run: getList
  } = useRequest(
    (params?: WithdrawalSearchParams) => {
      const finalParams = params || searchParams;
      return fetchGetWithdrawList(finalParams);
    },
    {
      manual: true
    }
  );

  const { run: handleApproveRequest } = useRequest(fetchPostWithdrawApprove, {
    manual: true
  });

  const { loading: rejectLoading, run: handleRejectRequest } = useRequest(fetchPostWithdrawApprove, {
    manual: true
  });

  // 初始化数据
  useEffect(() => {
    getList(searchParams);
  }, [getList, searchParams]);

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    const newSearchParams: WithdrawalSearchParams = {
      page: 1,
      page_size: searchParams.page_size || 10
    };

    if (values.keyword?.trim()) {
      newSearchParams.keyword = values.keyword.trim();
    }
    if (values.status) {
      newSearchParams.status = values.status;
    }
    if (values.platform) {
      newSearchParams.platform = values.platform;
    }
    if (values.approver_name?.trim()) {
      newSearchParams.approver_name = values.approver_name.trim();
    }
    if (values.app_id) {
      newSearchParams.app_id = values.app_id;
    }
    if (values.entity_id) {
      newSearchParams.entity_id = values.entity_id;
    }
    if (values.app_chan_id) {
      newSearchParams.app_chan_id = values.app_chan_id;
    }

    setSearchParams(newSearchParams);
    getList(newSearchParams);
  };

  const handleReset = () => {
    searchForm.resetFields();
    const resetParams = {
      page: 1,
      page_size: searchParams.page_size || 10
    };
    setSearchParams(resetParams);
    getList(resetParams);
  };

  const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
    const newParams = {
      ...searchParams,
      page: pagination.current || 1,
      page_size: pagination.pageSize || 10
    };
    setSearchParams(newParams);
    getList(newParams);
  };

  const handleApprove = async (record: Api.Withdraw.Info) => {
    setApproveLoadingId(record.id);
    try {
      await handleApproveRequest(record.id, {
        status: 'approved'
      });
      message.success('审批通过成功');
      getList(searchParams);
    } catch {
      message.error('审批通过失败，请稍后重试');
    } finally {
      setApproveLoadingId(null);
    }
  };

  const handleReject = (record: Api.Withdraw.Info) => {
    setSelectedRecord(record);
    setIsRejectModalVisible(true);
  };

  const handleRejectConfirm = async (remarks: string) => {
    if (selectedRecord) {
      try {
        await handleRejectRequest(selectedRecord.id, {
          remarks: remarks || '',
          status: 'rejected'
        });
        message.success('驳回成功');
        setIsRejectModalVisible(false);
        setSelectedRecord(null);
        getList(searchParams);
      } catch {
        message.error('驳回失败，请稍后重试');
      }
    }
  };

  const handleRejectCancel = () => {
    setIsRejectModalVisible(false);
    setSelectedRecord(null);
  };

  const handleViewDetail = (record: Api.Withdraw.Info) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalVisible(false);
    setSelectedRecord(null);
  };

  const data = response?.data?.list || [];
  const total = response?.data?.total || 0;

  return (
    <div className="p-4">
      <SearchForm
        form={searchForm}
        loading={loading}
        onReset={handleReset}
        onSearch={handleSearch}
      />

      <Card className="mt-4">
        <WithdrawalTable
          approveLoadingId={approveLoadingId || undefined}
          dataSource={data}
          loading={loading}
          pagination={{
            current: searchParams.page,
            pageSize: searchParams.page_size,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (totalCount, range) => `第 ${range[0]}-${range[1]} 条/共 ${totalCount} 条`,
            total
          }}
          onApprove={handleApprove}
          onChange={handleTableChange}
          onReject={handleReject}
          onViewDetail={handleViewDetail}
        />
      </Card>

      <ApprovalModal
        loading={rejectLoading}
        open={isRejectModalVisible}
        record={selectedRecord}
        onCancel={handleRejectCancel}
        onOk={handleRejectConfirm}
      />

      <DetailModal
        open={isDetailModalVisible}
        record={selectedRecord}
        onClose={handleDetailModalClose}
      />
    </div>
  );
};

export default WithdrawApproval;
