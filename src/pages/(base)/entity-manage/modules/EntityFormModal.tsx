import { Form } from 'antd';
import { useEffect } from 'react';

import type { EntityItem } from './types';

interface EntityFormModalProps {
  readonly initialValues?: Partial<EntityItem>;
  readonly loading?: boolean;
  readonly mode: 'add' | 'edit';
  readonly onClose: () => void;
  readonly onSubmit: (values: Partial<EntityItem>) => void;
  readonly visible: boolean;
}

export function EntityFormModal({
  initialValues,
  loading = false,
  mode,
  onClose,
  onSubmit,
  visible
}: EntityFormModalProps) {
  const [form] = Form.useForm();

  // 根据模式确定标题
  const modalTitle = mode === 'add' ? '新增公司' : '编辑公司';

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          domain: initialValues.domain,
          name: initialValues.name
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      // 表单验证失败
    }
  };

  return (
    <AModal
      confirmLoading={loading}
      open={visible}
      title={modalTitle}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <AForm
        form={form}
        layout="vertical"
      >
        <AForm.Item
          label="公司名称"
          name="name"
          rules={[
            { message: '请输入公司名称', required: true },
            { max: 50, message: '公司名称不能超过50个字符' }
          ]}
        >
          <AInput placeholder="请输入公司名称" />
        </AForm.Item>

        <AForm.Item
          label="域名"
          name="domain"
          rules={[{ max: 50, message: '域名不能超过50个字符' }]}
        >
          <AInput placeholder="请输入公司域名（选填）" />
        </AForm.Item>
      </AForm>
    </AModal>
  );
}
