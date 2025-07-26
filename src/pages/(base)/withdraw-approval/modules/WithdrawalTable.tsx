import type { ColumnsType, TableProps } from 'antd/es/table';
import dayjs from 'dayjs';

interface WithdrawalTableProps {
  approveLoadingId?: number;
  dataSource: Api.Withdraw.Info[];
  loading?: boolean;
  onApprove: (record: Api.Withdraw.Info) => void;
  onChange?: TableProps<Api.Withdraw.Info>['onChange'];
  onReject: (record: Api.Withdraw.Info) => void;
  onViewDetail: (record: Api.Withdraw.Info) => void;
  pagination?: TableProps<Api.Withdraw.Info>['pagination'];
}

export const WithdrawalTable = ({
  approveLoadingId,
  dataSource,
  loading,
  onApprove,
  onChange,
  onReject,
  onViewDetail,
  pagination
}: WithdrawalTableProps) => {
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      approved: 'lime',
      failed: 'volcano',
      paid: 'green',
      pending: 'gold',
      rejected: 'red'
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      approved: '已批准',
      failed: '支付失败',
      paid: '已支付',
      pending: '待审批',
      rejected: '已驳回'
    };
    return textMap[status] || status;
  };

  const columns: ColumnsType<Api.Withdraw.Info> = [
    {
      align: 'center',
      dataIndex: 'id',
      key: 'id',
      title: 'ID',
      width: 80
    },
    {
      align: 'center',
      dataIndex: 'uid',
      key: 'uid',
      title: '玩家ID',
      width: 120
    },
    {
      align: 'center',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      title: '提现金额',
      width: 120
    },
    {
      align: 'center',
      dataIndex: 'platform',
      key: 'platform',
      render: (platform: string) =>
        (() => {
          switch (platform) {
            case 'alipay':
              return '支付宝';
            case 'wechatpay':
              return '微信支付';
            default:
              return platform;
          }
        })(),
      title: '支付平台',
      width: 100
    },
    {
      align: 'center',
      key: 'payment_info',
      render: (_, record: Api.Withdraw.Info) => (
        <ASpace
          wrap
          size="small"
        >
          <ATag color="green">{record.real_name}</ATag>
          <ATag color="blue">{record.identity}</ATag>
        </ASpace>
      ),
      title: '打款信息',
      width: 280
    },
    {
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <ATag color={getStatusColor(status)}>{getStatusText(status)}</ATag>,
      title: '状态',
      width: 100
    },
    {
      align: 'center',
      dataIndex: 'app_name',
      ellipsis: true,
      key: 'app_name',
      title: '应用',
      width: 120
    },
    {
      align: 'center',
      dataIndex: 'app_chan_name',
      ellipsis: true,
      key: 'app_chan_name',
      title: '渠道',
      width: 120
    },
    {
      align: 'center',
      dataIndex: 'entity_name',
      ellipsis: true,
      key: 'entity_name',
      title: '主体'
    },
    {
      align: 'center',
      dataIndex: 'operator_name',
      key: 'operator_name',
      render: (operator_name: string, record: Api.Withdraw.Info) => {
        // 只有审批后的状态才显示操作人
        if (record.status === 'pending') {
          return '-';
        }
        return operator_name || '-';
      },
      title: '操作人',
      width: 100
    },
    {
      align: 'center',
      dataIndex: 'processed_at',
      key: 'processed_at',
      render: (processed_at: number, record: Api.Withdraw.Info) => {
        // 只有审批后的状态才显示处理时间
        if (record.status === 'pending' || !processed_at) {
          return '-';
        }
        return dayjs(processed_at * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
      title: '处理时间',
      width: 160
    },
    {
      align: 'center',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (createTime: string) => {
        if (!createTime) return '-';
        // 如果是时间戳格式（数字字符串），转换为毫秒
        const timestamp = /^\d+$/.test(createTime) ? Number(createTime) * 1000 : createTime;
        return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
      title: '提交时间',
      width: 160
    },
    {
      align: 'center',
      fixed: 'right',
      key: 'action',
      render: (_, record: Api.Withdraw.Info) => {
        if (record.status === 'pending') {
          // 待审批状态：显示审批操作
          return (
            <ASpace size="small">
              <APopconfirm
                disabled={approveLoadingId === record.id}
                title="确定批准审批吗？"
                onConfirm={() => onApprove(record)}
              >
                <AButton
                  loading={approveLoadingId === record.id}
                  size="small"
                  type="primary"
                >
                  批准
                </AButton>
              </APopconfirm>
              <AButton
                danger
                size="small"
                type="primary"
                onClick={() => onReject(record)}
              >
                驳回
              </AButton>
            </ASpace>
          );
        }
        // 已审批状态：显示查看详情
        return (
          <AButton
            size="small"
            type="link"
            onClick={() => onViewDetail(record)}
          >
            查看详情
          </AButton>
        );
      },
      title: '操作',
      width: 180
    }
  ];

  return (
    <ATable
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
      rowKey="id"
      scroll={{ x: 1600 }}
      size="small"
      onChange={onChange}
    />
  );
};
