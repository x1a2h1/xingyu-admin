import { useEffect } from 'react';

const { TextArea } = AInput;

interface ApprovalModalProps {
  loading?: boolean;
  onCancel: () => void;
  onOk: (remarks: string) => void;
  open: boolean;
  record: Api.Withdraw.Info | null;
}

export const ApprovalModal = ({ loading, onCancel, onOk, open, record }: ApprovalModalProps) => {
  const [form] = AForm.useForm();

  useEffect(() => {
    if (open && record) {
      form.resetFields();
    }
  }, [open, record, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        onOk(values.remarks || '');
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <AModal
      destroyOnClose
      confirmLoading={loading}
      open={open}
      title="驳回提现申请"
      width={600}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      {record && (
        <div className="mb-4 rounded bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">玩家ID：</span>
              <span className="font-medium">{record.uid}</span>
            </div>
            <div>
              <span className="text-gray-600">提现金额：</span>
              <span className="text-red-600 font-medium">¥{record.amount.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">打款信息：</span>
              <ASpace size="small">
                <ATag color="green">{record.real_name}</ATag>
                <ATag color="blue">{record.identity}</ATag>
              </ASpace>
            </div>
            <div>
              <span className="text-gray-600">支付平台：</span>
              <span className="font-medium">
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
              </span>
            </div>
          </div>
        </div>
      )}

      <AForm
        form={form}
        layout="vertical"
      >
        <AForm.Item
          label="驳回原因"
          name="remarks"
          rules={[{ max: 200, message: '驳回原因不能超过200个字符' }]}
        >
          <TextArea
            showCount
            maxLength={200}
            placeholder="请详细说明驳回原因，以便用户了解具体情况..."
            rows={4}
          />
        </AForm.Item>
      </AForm>
    </AModal>
  );
};
