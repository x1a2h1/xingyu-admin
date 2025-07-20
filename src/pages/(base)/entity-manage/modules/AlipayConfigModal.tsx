import { useEffect } from 'react';

interface AlipayConfigModalProps {
  readonly configData?: Api.Entity.AlipayConfig;
  readonly entityId: number;
  readonly isView?: boolean;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: any) => Promise<void>;
  readonly visible: boolean;
}

export function AlipayConfigModal({
  configData,
  entityId,
  isView = false,
  loading = false,
  onClose,
  onSubmit,
  visible
}: AlipayConfigModalProps) {
  const [form] = AForm.useForm<Api.Entity.AlipayConfig>();

  // 当modal打开或数据变化时，重置表单
  useEffect(() => {
    if (visible) {
      form.resetFields();

      if (configData) {
        // 编辑模式：设置已有数据
        form.setFieldsValue({
          ...configData,
          // 私钥不回显，保持为空
          private_key: undefined
        });
      } else {
        // 新建模式：设置实体ID
        form.setFieldsValue({ entity_id: entityId });
      }
    }
  }, [visible, configData, entityId, form]);

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 编辑模式下，如果私钥为空，则不提交私钥字段
      const submitValues: any = { ...values };
      if (configData && !submitValues.private_key) {
        delete submitValues.private_key;
      }

      await onSubmit(submitValues);
    } catch {
      // 表单验证失败，不做处理
    }
  };

  // 获取模态框标题
  const getModalTitle = () => {
    if (isView) {
      return '查看支付宝配置';
    }
    return configData ? '编辑支付宝配置' : '配置支付宝';
  };

  // 获取私钥字段的提示文本
  const getPrivateKeyPlaceholder = () => {
    if (configData) {
      return '留空则不修改私钥';
    }
    return '请输入应用私钥内容';
  };

  // 获取私钥字段的额外说明
  const getPrivateKeyExtra = () => {
    if (configData) {
      return '编辑模式下私钥选填，留空表示不修改';
    }
    return null;
  };

  return (
    <AModal
      destroyOnClose
      open={visible}
      title={getModalTitle()}
      width={600}
      footer={
        isView
          ? [
              <AButton
                key="close"
                onClick={onClose}
              >
                关闭
              </AButton>
            ]
          : [
              <AButton
                key="cancel"
                onClick={onClose}
              >
                取消
              </AButton>,
              <AButton
                key="submit"
                loading={loading}
                type="primary"
                onClick={handleSubmit}
              >
                确定
              </AButton>
            ]
      }
      onCancel={onClose}
    >
      <AForm
        scrollToFirstError
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        <AForm.Item
          hidden
          name="entity_id"
        >
          <AInput />
        </AForm.Item>

        <AForm.Item
          label="应用ID"
          name="app_id"
          rules={[
            { message: '请输入应用ID', required: true },
            { message: '应用ID只能包含数字', pattern: /^\d+$/ }
          ]}
        >
          <AInput
            disabled={isView}
            placeholder="请输入支付宝应用ID"
          />
        </AForm.Item>

        <AForm.Item
          extra={getPrivateKeyExtra()}
          label="应用私钥"
          name="private_key"
          rules={[
            {
              message: '请输入应用私钥',
              required: !configData
            }
          ]}
        >
          <AInput.TextArea
            showCount
            autoSize={{ maxRows: 8, minRows: 4 }}
            disabled={isView}
            placeholder={getPrivateKeyPlaceholder()}
          />
        </AForm.Item>

        <AForm.Item
          label="应用公钥证书"
          name="app_public_cert"
          rules={[{ message: '请输入应用公钥证书', required: true }]}
        >
          <AInput.TextArea
            showCount
            autoSize={{ maxRows: 8, minRows: 4 }}
            disabled={isView}
            placeholder="请输入应用公钥证书内容"
          />
        </AForm.Item>

        <AForm.Item
          label="支付宝公钥证书"
          name="public_cert"
          rules={[{ message: '请输入支付宝公钥证书', required: true }]}
        >
          <AInput.TextArea
            showCount
            autoSize={{ maxRows: 8, minRows: 4 }}
            disabled={isView}
            placeholder="请输入支付宝公钥证书内容"
          />
        </AForm.Item>

        <AForm.Item
          label="支付宝根证书"
          name="root_cert"
          rules={[{ message: '请输入支付宝根证书', required: true }]}
        >
          <AInput.TextArea
            showCount
            autoSize={{ maxRows: 8, minRows: 4 }}
            disabled={isView}
            placeholder="请输入支付宝根证书内容"
          />
        </AForm.Item>

        {isView && configData && (
          <AAlert
            showIcon
            className="mt-4"
            description="查看模式下不显示私钥信息"
            message="安全提示"
            type="info"
          />
        )}
      </AForm>
    </AModal>
  );
}
