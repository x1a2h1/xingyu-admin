import { useEffect } from 'react';

interface ChannelModalProps {
  readonly channel: Api.Channel.Info | null;
  readonly loading?: boolean; // 添加加载状态
  readonly onCancel: () => void;
  readonly onSave: (values: { name: string; remarks: string }, isEdit: boolean) => void;

  readonly visible: boolean;
}

function ChannelModal({ channel, loading = false, onCancel, onSave, visible }: ChannelModalProps) {
  const [form] = AForm.useForm();

  useEffect(() => {
    if (visible) {
      if (channel) {
        form.setFieldsValue({
          name: channel.name,
          remarks: channel.remarks
        });
      } else {
        form.resetFields();
      }
    }
  }, [form, visible, channel]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values, Boolean(channel));
    } catch {
      // 表单验证失败，AntD已经会自动显示错误消息
    }
  };

  return (
    <AModal
      destroyOnClose
      confirmLoading={loading} // 添加确认按钮加载状态
      open={visible}
      title={channel ? '编辑渠道' : '新增渠道'}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <AForm
        form={form}
        layout="vertical"
      >
        <AForm.Item
          label="渠道名称"
          name="name"
          rules={[{ message: '请输入渠道名称', required: true }]}
        >
          <AInput placeholder="请输入渠道名称" />
        </AForm.Item>
        <AForm.Item
          label="备注"
          name="remarks"
        >
          <AInput.TextArea
            placeholder="请输入备注信息"
            rows={4}
          />
        </AForm.Item>
      </AForm>
    </AModal>
  );
}

export default ChannelModal;
