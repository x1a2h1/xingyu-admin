import { useEffect } from 'react';

type SupportedPlatform = 'adnetqq' | 'csj' | 'kwai' | 'taku';

interface PlatformConfigModalProps {
  readonly configData: any;
  readonly entityId: number;
  readonly isView?: boolean;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: any) => void;
  readonly platformType: SupportedPlatform;
  readonly visible: boolean;
}

export function PlatformConfigModal({
  configData,
  entityId,
  isView = false,
  loading = false,
  onClose,
  onSubmit,
  platformType,
  visible
}: PlatformConfigModalProps) {
  const [form] = AForm.useForm();

  // 当modal打开或平台/数据变化时，重置表单
  useEffect(() => {
    if (visible) {
      form.resetFields();

      // 设置表单初始值，如果是编辑或查看模式
      if (configData) {
        form.setFieldsValue(configData);
      } else {
        // 新建时设置实体ID
        form.setFieldsValue({ entity_id: entityId });
      }
    }
  }, [visible, configData, entityId, form]);

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      // 表单验证失败
    }
  };

  // 根据平台类型渲染不同的表单项
  const renderFormItems = () => {
    switch (platformType) {
      case 'csj':
        return (
          <>
            <AForm.Item
              hidden
              name="entity_id"
            >
              <AInput />
            </AForm.Item>
            <AForm.Item
              label="账户ID"
              name="user_id"
              rules={[{ message: '请输入UserID', required: true }]}
            >
              <AInput
                disabled={isView}
                placeholder="请输入穿山甲UserID"
              />
            </AForm.Item>
            <AForm.Item
              label="子账户ID"
              name="role_id"
              rules={[{ message: '请输入子账户ID', required: true }]}
            >
              <AInput
                disabled={isView}
                placeholder="请输入子账户RoleID，没有则与账户ID相同"
              />
            </AForm.Item>
            <AForm.Item
              label="安全密钥"
              name="security_key"
              rules={[{ message: '请输入security_key', required: true }]}
            >
              <AInput.Password
                disabled={isView}
                placeholder="请输入security_key"
              />
            </AForm.Item>
          </>
        );

      case 'taku':
        return (
          <>
            <AForm.Item
              hidden
              name="entity_id"
            >
              <AInput />
            </AForm.Item>
            <AForm.Item
              label="访问密钥"
              name="publisher_id"
              rules={[{ message: '请输入Publisher ID', required: true }]}
            >
              <AInput
                disabled={isView}
                placeholder="请输入Taku Publisher ID"
              />
            </AForm.Item>
          </>
        );

      case 'kwai':
        return (
          <>
            <AForm.Item
              hidden
              name="entity_id"
            >
              <AInput />
            </AForm.Item>
            <AForm.Item
              label="账户ID"
              name="access_key"
              rules={[{ message: '请输入Access Key', required: true }]}
            >
              <AInput
                disabled={isView}
                placeholder="请输入快手Access Key"
              />
            </AForm.Item>
            <AForm.Item
              label="安全密钥"
              name="security_key"
              rules={[{ message: '请输入security_key', required: true }]}
            >
              <AInput.Password
                disabled={isView}
                placeholder="请输入安全密钥"
              />
            </AForm.Item>
          </>
        );

      case 'adnetqq':
        return (
          <>
            <AForm.Item
              hidden
              name="entity_id"
            >
              <AInput />
            </AForm.Item>
            <AForm.Item
              label="账户ID"
              name="member_id"
              rules={[{ message: '请输入member_id', required: true }]}
            >
              <AInput
                disabled={isView}
                placeholder="请输入优量汇账户ID"
              />
            </AForm.Item>
            <AForm.Item
              label="密钥"
              name="secret"
              rules={[{ message: '请输入密钥', required: true }]}
            >
              <AInput.Password
                disabled={isView}
                placeholder="请输入优量汇密钥"
              />
            </AForm.Item>
          </>
        );

      default:
        return <div>未知平台类型</div>;
    }
  };

  // 获取对应平台的标题
  const getModalTitle = () => {
    const platformNames: Record<SupportedPlatform, string> = {
      adnetqq: '优量汇',
      csj: '穿山甲',
      kwai: '快手',
      taku: 'Taku'
    };

    let operationType = '配置';
    if (isView) {
      operationType = '查看';
    } else if (configData) {
      operationType = '编辑';
    }
    return `${operationType}${platformNames[platformType]}平台配置`;
  };

  return (
    <AModal
      open={visible}
      title={getModalTitle()}
      width={520}
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
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        {renderFormItems()}
      </AForm>
    </AModal>
  );
}
