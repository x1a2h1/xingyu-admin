import { useRequest, useUpdateEffect } from 'ahooks';
import { Form, Input, Modal, Select, message } from 'antd';
import { type FC, useEffect, useState } from 'react';

import { fetchGetRoles, fetchPostUser, fetchPutUser } from '@/service/api';

interface UserFormModalProps {
  readonly editingUser: Api.User.Info | null;
  readonly onCancel: () => void;
  readonly onSuccess: () => void;
  readonly open: boolean;
}

export const UserFormModal: FC<UserFormModalProps> = ({ editingUser, onCancel, onSuccess, open }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(editingUser);
  const title = isEdit ? '编辑用户' : '新增用户';

  const {
    data: response,
    loading: roleLoading,
    run: getRoleList
  } = useRequest(fetchGetRoles, {
    manual: true
  });

  // 从响应中提取数据
  const roleData = response?.data || null;

  // 提取角色ID的辅助函数
  const extractRoleIds = (roleList: Api.Role.Info[] | null): number[] => {
    if (!roleList || !Array.isArray(roleList)) return [];
    return roleList.map(role => Number(role.id)).filter(id => id > 0);
  };

  const init = async () => {
    await getRoleList();
  };

  // 只在模态窗口打开时加载角色列表
  useUpdateEffect(() => {
    if (open) {
      init();
    }
  }, [open]);

  // 设置表单初始值
  useUpdateEffect(() => {
    if (open && isEdit && editingUser && !roleLoading && roleData?.list) {
      const roleIds = extractRoleIds(editingUser.role_list);

      const formValues = {
        account: editingUser.account || '',
        cellphone: editingUser.cellphone || '',
        email: editingUser.email || '',
        nickname: editingUser.nickname || '',
        password: '',
        remark: editingUser.remark || '',
        role_ids: roleIds
      };

      form.setFieldsValue(formValues);
    }
  }, [open, isEdit, editingUser, roleLoading, roleData, form, extractRoleIds]);

  // 打开模态窗口时处理表单
  useEffect(() => {
    if (open) {
      if (!isEdit) {
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [form, open, isEdit]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formattedValues = {
        ...values,
        role_ids: values.role_ids?.map((id: string | number) => Number(id)) || []
      };

      if (isEdit && editingUser) {
        await fetchPutUser(editingUser.id.toString(), formattedValues);
        message.success('编辑用户成功');
      } else {
        await fetchPostUser(formattedValues);
        message.success('新增用户成功');
      }

      onSuccess();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        // 表单验证错误，不显示消息
      } else {
        const errorMsg =
          error &&
          typeof error === 'object' &&
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'data' in error.response &&
          error.response.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data &&
          typeof error.response.data.message === 'string'
            ? error.response.data.message
            : `${isEdit ? '编辑' : '新增'}用户失败`;
        message.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      destroyOnClose
      confirmLoading={loading}
      maskClosable={false}
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form
        autoComplete="off"
        form={form}
        layout="vertical"
        requiredMark={true}
      >
        <Form.Item
          label="账号"
          name="account"
          rules={[
            { max: 20, message: '账号最多20个字符' },
            { message: '请输入账号', required: !isEdit }
          ]}
        >
          <Input
            disabled={isEdit}
            placeholder="请输入账号"
          />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ message: '请输入密码', required: !isEdit }]}
        >
          <Input.Password placeholder={isEdit ? '不修改请留空' : '请输入密码'} />
        </Form.Item>

        <Form.Item
          label="昵称"
          name="nickname"
          rules={[{ max: 20, message: '昵称最多20个字符' }]}
        >
          <Input placeholder="请输入昵称" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { message: '请输入有效的邮箱地址', type: 'email' },
            { max: 50, message: '邮箱最多50个字符' }
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="cellphone"
          rules={[{ message: '请输入有效的手机号', pattern: /^1[0-9]{10}$/ }]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
        >
          <Input.TextArea
            placeholder="请输入备注"
            rows={2}
          />
        </Form.Item>

        <Form.Item
          label="角色"
          name="role_ids"
          rules={[{ message: '请选择至少一个角色', required: true }]}
        >
          <Select
            showSearch
            loading={roleLoading}
            mode="multiple"
            optionFilterProp="label"
            placeholder="请选择角色"
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={(() => {
              if (roleLoading) return '加载中...';
              if (!roleData?.list?.length) return '无可用角色';
              return '未找到';
            })()}
            options={roleData?.list?.map((role: Api.Role.Info) => ({
              label: role.name,
              value: Number(role.id)
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
