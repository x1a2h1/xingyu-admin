interface ChannelTableProps {
  readonly data: Api.AppChan.Info[];
  readonly loading?: boolean;
  readonly onDelete: (id: number | string) => void;
  readonly onEdit?: (record: Api.AppChan.Info) => void;
  readonly onPageChange?: (page: number, pageSize: number) => void;
  readonly pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

export function ChannelTable({ data, loading, onDelete, onPageChange, pagination }: ChannelTableProps) {
  const columns = [
    {
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => (
        <span className="text-gray-500 font-mono">{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
      ),
      title: '序号',
      width: 80
    },
    {
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="text-gray-900 font-medium">{text || '-'}</span>,
      title: '关联名称',
      width: 150
    },
    {
      dataIndex: 'channel',
      key: 'channel',
      render: (_: string, record: Api.AppChan.Info) => (
        <ASpace>
          <div className="i-carbon:connection-signal text-blue-500" />
          <span className="text-blue-600 font-medium">{record.channel?.name || '-'}</span>
        </ASpace>
      ),
      title: '渠道信息',
      width: 150
    },
    {
      dataIndex: 'app',
      key: 'app',
      render: (_: string, record: Api.AppChan.Info) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="i-carbon:application text-green-500" />
            <span className="text-gray-900 font-medium">{record.app?.app_name || '-'}</span>
          </div>
          <div className="text-xs text-gray-500">{record.app?.package_name || '-'}</div>
        </div>
      ),
      title: '应用信息',
      width: 200
    },
    {
      dataIndex: 'entity',
      key: 'entity',
      render: (_: string, record: Api.AppChan.Info) => (
        <ASpace>
          <div className="i-carbon:enterprise text-purple-500" />
          <span className="text-gray-700">{record.app?.entity?.name || '-'}</span>
        </ASpace>
      ),
      title: '主体公司',
      width: 150
    },
    {
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text: string) => (
        <ATooltip title={text || '无备注'}>
          <span className="block max-w-32 truncate text-gray-600">{text || '-'}</span>
        </ATooltip>
      ),
      title: '备注',
      width: 120
    },
    {
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text: string) => {
        if (!text) return <span className="text-gray-400">-</span>;

        try {
          const date = new Date(text);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');

          return (
            <div className="text-sm text-gray-600">
              <div>
                {year}-{month}-{day}
              </div>
              <div className="text-xs text-gray-400">
                {hours}:{minutes}
              </div>
            </div>
          );
        } catch {
          return <span className="text-gray-400">-</span>;
        }
      },
      title: '创建时间',
      width: 120
    },
    {
      dataIndex: 'creator',
      key: 'creator',
      render: (_: any, record: Api.AppChan.Info) => (
        <ASpace>
          <div className="i-carbon:user text-gray-400" />
          <span className="text-gray-600">{(record.creator as any)?.nickname || '-'}</span>
        </ASpace>
      ),
      title: '创建人',
      width: 120
    },
    {
      fixed: 'right' as const,
      key: 'action',
      render: (_: any, record: Api.AppChan.Info) => (
        <APopconfirm
          cancelText="取消"
          okText="确定"
          title={
            <div>
              <p>确定删除此关联吗？</p>
              <p className="mt-1 text-xs text-gray-500">
                应用：{record.app?.app_name} - 渠道：{record.channel?.name}
              </p>
            </div>
          }
          onConfirm={() => onDelete(record.id)}
        >
          <AButton
            danger
            size="small"
            type="link"
          >
            删除
          </AButton>
        </APopconfirm>
      ),
      title: '操作',
      width: 80
    }
  ];

  return (
    <ATable
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      scroll={{ x: 1200 }}
      size="middle"
      locale={{
        emptyText: (
          <div className="py-8 text-center">
            <div className="i-carbon:no-image mb-2 text-4xl text-gray-300" />
            <p className="text-gray-500">暂无数据</p>
            <p className="mt-1 text-xs text-gray-400">请尝试调整搜索条件或新增关联配置</p>
          </div>
        )
      }}
      pagination={{
        ...pagination,
        onChange: onPageChange,
        pageSizeOptions: ['10', '20', '50', '100'],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `第 ${range?.[0]}-${range?.[1]} 条，共 ${total} 条记录`
      }}
    />
  );
}
