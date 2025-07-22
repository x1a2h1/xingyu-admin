import { useEffect, useState } from 'react';

import { fetchGetChannelList } from '@/service/api';

interface ChannelFormModalProps {
  readonly appOptions: { label: string; value: number }[];
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: any) => void;
  readonly visible: boolean;
}

export function ChannelFormModal({ appOptions, loading, onClose, onSubmit, visible }: ChannelFormModalProps) {
  const [form] = AForm.useForm();
  const [channelOptions, setChannelOptions] = useState<{ label: string; value: number }[]>([]);
  const [channelLoading, setChannelLoading] = useState(false);

  // 获取渠道列表
  const fetchChannels = async () => {
    setChannelLoading(true);
    try {
      const res = await fetchGetChannelList({ pageSize: 100 }); // 获取足够多的渠道数据
      if (res?.data?.list) {
        const options = res.data.list.map((channel: Api.Channel.Info) => ({
          label: channel.name,
          value: channel.id
        }));
        setChannelOptions(options);
      }
    } catch {
      // do not log error
    } finally {
      setChannelLoading(false);
    }
  };

  // 组件挂载和弹窗显示时获取渠道列表
  useEffect(() => {
    if (visible) {
      fetchChannels();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      // do not log error
    }
  };

  return (
    <AModal
      destroyOnClose
      confirmLoading={loading}
      maskClosable={false}
      open={visible}
      width={600}
      title={
        <div className="flex items-center space-x-2">
          <div className="i-carbon:add text-lg" />
          <span>新增关联配置</span>
        </div>
      }
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <div className="mb-4 border border-blue-200 rounded-lg bg-blue-50 p-3">
        <div className="flex items-start space-x-2">
          <div className="i-carbon:information mt-0.5 text-blue-500" />
          <div className="text-sm text-blue-700">
            <p className="mb-1 font-medium">关联配置说明</p>
            <p>将应用与渠道进行关联，用于控制应用打包时的参数配置。每个关联代表一个特定的打包配置组合。</p>
          </div>
        </div>
      </div>

      <AForm
        form={form}
        layout="vertical"
      >
        <ARow gutter={16}>
          <ACol span={12}>
            <AForm.Item
              name="channel_id"
              rules={[{ message: '请选择渠道', required: true }]}
              label={
                <div className="flex items-center space-x-1">
                  <div className="i-carbon:connection-signal text-blue-500" />
                  <span>选择渠道</span>
                </div>
              }
            >
              <ASelect
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                loading={channelLoading}
                options={channelOptions}
                placeholder="请选择渠道"
              />
            </AForm.Item>
          </ACol>
          <ACol span={12}>
            <AForm.Item
              name="app_id"
              rules={[{ message: '请选择APP', required: true }]}
              label={
                <div className="flex items-center space-x-1">
                  <div className="i-carbon:application text-green-500" />
                  <span>选择应用</span>
                </div>
              }
            >
              <ASelect
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={appOptions}
                placeholder="请选择APP"
              />
            </AForm.Item>
          </ACol>
        </ARow>

        <AForm.Item
          name="remarks"
          label={
            <div className="flex items-center space-x-1">
              <div className="i-carbon:document text-gray-500" />
              <span>备注信息</span>
            </div>
          }
        >
          <AInput.TextArea
            showCount
            maxLength={200}
            placeholder="请输入备注信息，如特殊配置说明、用途描述等"
            rows={4}
          />
        </AForm.Item>
      </AForm>
    </AModal>
  );
}
