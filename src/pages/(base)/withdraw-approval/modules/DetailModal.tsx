import { Descriptions, Modal, Steps, Tag } from 'antd';
import dayjs from 'dayjs';

interface DetailModalProps {
  onClose: () => void;
  open: boolean;
  record: Api.Withdraw.Info | null;
}

export const DetailModal = ({ onClose, open, record }: DetailModalProps) => {
  if (!record) return null;

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

  const formatTime = (timestamp: number | string | undefined) => {
    if (!timestamp) return '-';

    let time: number | string;
    if (typeof timestamp === 'string') {
      // 采用和表格一致的逻辑：检查是否是纯数字字符串
      time = /^\d+$/.test(timestamp) ? Number(timestamp) * 1000 : timestamp;
    } else {
      // 数字时间戳，判断是秒还是毫秒
      time = timestamp <= 9999999999 ? timestamp * 1000 : timestamp;
    }

    const date = dayjs(time);
    return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : '-';
  };

  // 步骤条数据
  const getStepsData = () => {
    const steps: Array<{ description: string; status: 'error' | 'finish' | 'process' | 'wait'; title: string }> = [
      {
        description: formatTime(record.create_time),
        status: 'finish',
        title: '提交申请'
      }
    ];

    if (record.status !== 'pending') {
      steps.push({
        description: `${record.operator_name || '系统'} - ${formatTime(record.processed_at)}`,
        status: record.status === 'rejected' ? 'error' : 'finish',
        title: record.status === 'rejected' ? '审批驳回' : '审批通过'
      });
    }

    if (record.status === 'paid') {
      steps.push({
        description: `${record.operator_name || '系统'} - ${formatTime(record.processed_at)}`,
        status: 'finish',
        title: '支付完成'
      });
    } else if (record.status === 'failed') {
      steps.push({
        description: `${record.operator_name || '系统'} - ${formatTime(record.processed_at)}`,
        status: 'error',
        title: '支付失败'
      });
    } else if (record.status === 'approved') {
      steps.push({
        description: '系统处理中...',
        status: 'process',
        title: '等待支付'
      });
    }

    return steps;
  };

  return (
    <Modal
      destroyOnClose
      footer={null}
      open={open}
      title="申请详情"
      width={800}
      onCancel={onClose}
    >
      <div className="space-y-6">
        {/* 基本申请信息 */}
        <div>
          <h3 className="mb-4 text-lg font-medium">基本信息</h3>
          <Descriptions
            bordered
            column={2}
            size="small"
          >
            <Descriptions.Item label="玩家UID">{record.uid}</Descriptions.Item>
            <Descriptions.Item label="申请时间">{formatTime(record.create_time)}</Descriptions.Item>
            <Descriptions.Item label="提现金额">
              <span className="text-lg text-red-600 font-bold">¥{record.amount.toFixed(2)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="支付平台">
              {(() => {
                switch (record.platform) {
                  case 'alipay':
                    return '支付宝';
                  case 'wechatpay':
                    return '微信支付';
                  default:
                    return record.platform;
                }
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="真实姓名">{record.real_name}</Descriptions.Item>
            <Descriptions.Item label="收款账号">{record.identity}</Descriptions.Item>
            <Descriptions.Item label="应用名称">{record.app?.app_name || '-'}</Descriptions.Item>
            <Descriptions.Item label="渠道名称">{record.app_chan?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="主体名称">{record.entity?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="当前状态">
              <Tag color={getStatusColor(record.status)}>{getStatusText(record.status)}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* 操作信息 */}
        {record.status !== 'pending' && (
          <div>
            <h3 className="mb-4 text-lg font-medium">操作信息</h3>
            <Descriptions
              bordered
              column={2}
              size="small"
            >
              <Descriptions.Item label="操作人">{record.operator_name || '-'}</Descriptions.Item>
              <Descriptions.Item label="操作时间">{formatTime(record.processed_at)}</Descriptions.Item>
              <Descriptions.Item label="操作结果">
                <Tag color={getStatusColor(record.status)}>{getStatusText(record.status)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label="操作备注"
                span={2}
              >
                {record.operator_remarks || '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}

        {/* 支付信息 */}
        {['approved', 'paid', 'failed'].includes(record.status) && (
          <div>
            <h3 className="mb-4 text-lg font-medium">支付信息</h3>
            <Descriptions
              bordered
              column={1}
              labelStyle={{ maxWidth: 140, minWidth: 120 }}
              size="small"
            >
              <Descriptions.Item
                label="业务订单号"
                style={{ padding: '8px 12px' }}
              >
                <span className="break-all text-sm leading-normal font-mono">{record.out_biz_no || '-'}</span>
              </Descriptions.Item>
              <Descriptions.Item
                label="支付订单号"
                style={{ padding: '8px 12px' }}
              >
                <span className="break-all text-sm leading-normal font-mono">{record.payment_order_id || '-'}</span>
              </Descriptions.Item>
              <Descriptions.Item
                label="资金流水号"
                style={{ padding: '8px 12px' }}
              >
                <span className="break-all text-sm leading-normal font-mono">{record.pay_fund_order_id || '-'}</span>
              </Descriptions.Item>
              {record.remarks && (
                <Descriptions.Item
                  label="系统备注"
                  style={{ padding: '8px 12px' }}
                >
                  <span className="break-all leading-normal">{record.remarks}</span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}

        {/* 流程时间线 */}
        <div>
          <h3 className="mb-4 text-lg font-medium">处理流程</h3>
          <Steps
            direction="vertical"
            items={getStepsData()}
            size="small"
          />
        </div>
      </div>
    </Modal>
  );
};
