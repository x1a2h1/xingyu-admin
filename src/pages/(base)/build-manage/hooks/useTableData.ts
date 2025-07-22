import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { fetchGetAppChanList, fetchGetAppList, fetchPostAppChan } from '@/service/api';

interface TableQueryParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

interface TableDataResult {
  currentPage: number;
  data: Api.AppChan.Info[];
  loading: boolean;
  pageSize: number;
  refresh: () => void;
  setQueryParams: React.Dispatch<React.SetStateAction<TableQueryParams>>;
  total: number;
}

export function useTableData(initialParams: TableQueryParams): TableDataResult {
  const [queryParams, setQueryParams] = useState<TableQueryParams>(initialParams);

  const {
    data,
    loading,
    run: refresh
  } = useRequest(fetchGetAppChanList, {
    defaultParams: [queryParams],
    refreshDeps: [queryParams]
  });

  const tableData = data?.data?.list || [];
  const total = data?.data?.total || 0;
  const currentPage = queryParams.page || 1;
  const currentPageSize = queryParams.pageSize || 10;

  return {
    currentPage,
    data: tableData,
    loading,
    pageSize: currentPageSize,
    refresh,
    setQueryParams,
    total
  };
}

interface AppCacheData {
  data: Api.Application.Info[];
  loading: boolean;
  refresh: () => void;
}

export function useAppCache(): AppCacheData {
  const {
    data,
    loading,
    run: refresh
  } = useRequest(fetchGetAppList, {
    defaultParams: [{ pageSize: 100 }],
    // 5分钟缓存
    manual: false,
    staleTime: 5 * 60 * 1000
  });

  return {
    data: data?.data?.list || [],
    loading,
    refresh
  };
}

interface ChannelFormData {
  app_id: number;
  channel_id: number;
  name: string;
  remarks: string;
}

interface UseCreateModalAPI {
  close: () => void;
  onSubmit: (values: ChannelFormData) => Promise<void>;
  open: () => void;
  submitting: boolean;
  visible: boolean;
}

export function useCreateModal(refreshTable: () => void): UseCreateModalAPI {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const urlParams = useSearchParams();
  const modalKeyParam = urlParams[0].get('modal');

  const { loading: submitting, run: createRecord } = useRequest(fetchPostAppChan, {
    manual: true,
    onError: () => {
      window.$message?.error('创建失败');
    },
    onSuccess: () => {
      refreshTable();
      setVisible(false);
      window.$message?.success('创建成功');
    }
  });

  // 通过URL参数控制模态框打开状态
  useEffect(() => {
    if (modalKeyParam === 'create') {
      setVisible(true);
    }
  }, [modalKeyParam]);

  const openModal = () => {
    navigate('/build-manage?modal=create');
  };

  const closeModal = () => {
    navigate('/build-manage');
  };

  const handleSubmit = async (values: ChannelFormData) => {
    await createRecord(values);
  };

  return {
    close: closeModal,
    onSubmit: handleSubmit,
    open: openModal,
    submitting,
    visible
  };
}
