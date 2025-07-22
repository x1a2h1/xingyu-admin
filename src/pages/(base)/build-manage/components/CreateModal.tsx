import { useState } from 'react';

interface CreateModalProps {
  appData?: Api.Application.Info[] | null;
  appOptions: Array<{ label: string; value: number }>;
  channelOptions: Array<{ label: string; value: number }>;
  loading: boolean;
  onClose: () => void;
  onRefresh?: () => void;
  onSubmit: (values: { app_id: number; channel_id: number; name: string; remarks: string }) => Promise<void>;
  visible: boolean;
}

export function CreateModal({ appOptions, channelOptions, loading, onClose, onSubmit, visible }: CreateModalProps) {
  const [form] = AForm.useForm();
  const [currentAppId, setCurrentAppId] = useState<number | null>(null);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch {
      // do not log error
    }
  };

  const handleClose = () => {
    form.resetFields();
    setCurrentAppId(null);
    onClose();
  };

  return (
    <AModal
      cancelText="取消"
      confirmLoading={loading}
      okText="确定创建"
      open={visible}
      title="新增应用渠道关联"
      width={480}
      onCancel={handleClose}
      onOk={handleSubmit}
    >
      <AForm
        form={form}
        layout="vertical"
      >
        <AForm.Item
          label="关联名称"
          name="name"
          rules={[
            { message: '请输入关联名称', required: true },
            { max: 50, message: '关联名称不能超过50个字符' }
          ]}
        >
          <AInput placeholder="例如：抖音渠道-旅行应用" />
        </AForm.Item>

        <AForm.Item
          label="选择应用"
          name="app_id"
          rules={[{ message: '请选择应用', required: true }]}
        >
          <ASelect
            allowClear
            options={appOptions}
            placeholder="请选择应用"
            notFoundContent={
              <div className="py-4 text-center text-gray-500">
                <div className="i-carbon:warning mb-2 text-2xl" />
                <div>暂无应用数据</div>
                <div className="mt-1 text-xs text-gray-400">请先添加应用</div>
              </div>
            }
            onChange={value => setCurrentAppId(value)}
          />
        </AForm.Item>

        <AForm.Item
          label="选择渠道"
          name="channel_id"
          rules={[{ message: '请选择渠道', required: true }]}
        >
          <ASelect
            allowClear
            options={channelOptions}
            placeholder="请选择渠道"
            notFoundContent={
              <div className="py-4 text-center text-gray-500">
                <div className="i-carbon:warning mb-2 text-2xl" />
                <div>暂无渠道数据</div>
                <div className="mt-1 text-xs text-gray-400">请先添加渠道</div>
              </div>
            }
          />
        </AForm.Item>

        <AForm.Item
          label="备注"
          name="remarks"
          rules={[{ max: 200, message: '备注不能超过200个字符' }]}
        >
          <AInput.TextArea
            showCount
            maxLength={200}
            placeholder="请输入关联的备注信息，如用途描述、特殊说明等"
            rows={3}
          />
        </AForm.Item>

        {currentAppId && (
          <AAlert
            className="mb-4"
            showIcon={false}
            type="info"
            description={
              <div className="text-sm">
                <div>当前选择的应用ID: {currentAppId}</div>
                <div className="text-gray-600">请确保选择的渠道与该应用匹配</div>
              </div>
            }
          />
        )}
      </AForm>
    </AModal>
  );
}
