import { useEffect } from 'react';

interface ConfigModalProps {
  readonly channel: Api.Channel.Info | null;
  readonly loading?: boolean;
  readonly onCancel: () => void;
  readonly onSave: (values: Api.Channel.Options) => void;
  readonly visible: boolean;
}

function ConfigModal({ channel, loading = false, onCancel, onSave, visible }: ConfigModalProps) {
  const [form] = AForm.useForm();

  useEffect(() => {
    if (visible && channel) {
      // 设置配置项的初始值
      form.setFieldsValue({
        greeter_login: channel.options?.greeter_login || false,
        qq_login: channel.options?.qq_login || false,
        wechat_login: channel.options?.wechat_login || false
      });
    } else if (visible && !channel) {
      form.resetFields();
    }
  }, [form, visible, channel]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch {
      // 表单验证失败，AntD已经会自动显示错误消息
    }
  };

  return (
    <AModal
      destroyOnClose
      confirmLoading={loading}
      open={visible}
      title={`配置渠道：${channel?.name || ''}`}
      width={600}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <AForm
        form={form}
        layout="vertical"
      >
        <ARow gutter={16}>
          <ACol span={8}>
            <AForm.Item
              label="游客登录"
              name="greeter_login"
              valuePropName="checked"
            >
              <ASwitch />
            </AForm.Item>
          </ACol>
          <ACol span={8}>
            <AForm.Item
              label="QQ登录"
              name="qq_login"
              valuePropName="checked"
            >
              <ASwitch />
            </AForm.Item>
          </ACol>
          <ACol span={8}>
            <AForm.Item
              label="微信登录"
              name="wechat_login"
              valuePropName="checked"
            >
              <ASwitch />
            </AForm.Item>
          </ACol>
        </ARow>
      </AForm>
    </AModal>
  );
}

export default ConfigModal;
