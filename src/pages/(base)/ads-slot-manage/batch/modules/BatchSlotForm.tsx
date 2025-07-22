import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchBatchCreateSlot, fetchGetAppList, fetchGetECPMList } from '@/service/api';

export function BatchSlotForm() {
  // 获取导航函数
  const navigate = useNavigate();
  // 使用AForm表单
  const [form] = AForm.useForm();
  // 为了解决选择问题，仍保留部分UI状态
  const [platform, setPlatform] = useState(form.getFieldValue('platform') || 'kwai');
  // 加载App列表
  const {
    data: apps,
    loading: appsLoading,
    run: _
  } = useRequest(fetchGetAppList, {
    manual: false
  });

  // 加载eCPM配置列表
  const {
    data: ecpmList,
    loading: ecpmLoading,
    run: fetchEcpmList
  } = useRequest(fetchGetECPMList, {
    manual: true
  });

  // 批量创建代码位
  const {
    data: batchCreateData,
    loading: batchCreateLoading,
    run: batchCreateSlot
  } = useRequest(fetchBatchCreateSlot, {
    manual: true
  });

  // 广告平台选项 - 添加logo
  const platformOptions = [
    {
      label: '快手',
      logo: '/kwai_logo.png',
      value: 'kwai'
    },
    {
      label: '穿山甲',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iMjMiIHZpZXdCb3g9IjAgMCA0OCAyMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGQ9Ik0zNi43OTcxIDExLjIyMDNMMzIuMDQ3MSA4LjQ5ODI4QzMxLjk0MzEgOC40Mzg4OSAzMS44MTM1IDguNTE0MTIgMzEuODEzNSA4LjYzMzg5VjE1LjM5ODJDMzEuODEzNSAxNS41MTkgMzEuODc3OCAxNS42MzA4IDMxLjk4MjcgMTUuNjkxMkwzNi43MzI4IDE4LjQxMzJDMzYuODM2NyAxOC40NzI1IDM2Ljk2NjQgMTguMzk3MyAzNi45NjY0IDE4LjI3NzZWMTEuNTEzMkMzNi45NjY0IDExLjM5MjUgMzYuOTAyMSAxMS4yODA2IDM2Ljc5NzEgMTEuMjIwM1oiIGZpbGw9IiNGRjAwMTciLz4KPHBhdGggZD0iTTMwLjMxMzggNy41MDQ5MkwyNS41NjM3IDQuNzgyOTVDMjUuNDU5NyA0LjcyMzU2IDI1LjMzMDEgNC43OTg3OSAyNS4zMzAxIDQuOTE4NTVWMTUuNDM3MkMyNS4zMzAxIDE1LjUyMzMgMjUuMzk5NCAxNS41OTI2IDI1LjQ4NTUgMTUuNTkyNkgzMC4zMjY2QzMwLjQxMjcgMTUuNTkyNiAzMC40ODIgMTUuNTIzMyAzMC40ODIgMTUuNDM3MlY3Ljc5NzlDMzAuNDgzIDcuNjc3MTQgMzAuNDE4NyA3LjU2NTI5IDMwLjMxMzggNy41MDQ5MloiIGZpbGw9IiNGRjAwMTciLz4KPHBhdGggZD0iTTE5LjA3OTMgMTguNDEyNUwyMy44Mjk0IDE1LjY5MDVDMjMuOTM0MyAxNS42MzAyIDIzLjk5ODYgMTUuNTE4MyAyMy45OTg2IDE1LjM5NzZWNC4xNTYzNUMyMy45OTg2IDQuMDM2NTggMjMuODY5IDMuOTYxMzYgMjMuNzY1IDQuMDIwNzRMMTkuMDE1IDYuNzQyNzFDMTguOTEgNi44MDMwOSAxOC44NDU3IDYuOTE0OTMgMTguODQ1NyA3LjAzNTY5VjE4LjI3NjlDMTguODQ2NyAxOC4zOTY3IDE4Ljk3NTQgMTguNDcxOSAxOS4wNzkzIDE4LjQxMjVaIiBmaWxsPSIjRkYwMDE3Ii8+CjxwYXRoIGQ9Ik0zOC4yOTc5IDEyLjM0OTNWMTUuNDM3NUMzOC4yOTc5IDE1LjUyMzYgMzguMzY3MSAxNS41OTI5IDM4LjQ1MzMgMTUuNTkyOUg0My44NDI3QzQ0LjAwMjEgMTUuNTkyOSA0NC4wNTg0IDE1LjM4MTEgNDMuOTE5OCAxNS4zMDE5TDM4LjUzMDQgMTIuMjEzN0MzOC40MjY0IDEyLjE1NTMgMzguMjk3OSAxMi4yMjk1IDM4LjI5NzkgMTIuMzQ5M1oiIGZpbGw9IiNGRjAwMTciLz4KPHBhdGggZD0iTTE3LjI4MTYgNy43MzYyMkw0LjA3NzY0IDE1LjMwMjNDMy45MzkwNyAxNS4zODE1IDMuOTk1NDkgMTUuNTkzMyA0LjE1NDg1IDE1LjU5MzNIMTcuMzU4OEMxNy40NDUgMTUuNTkzMyAxNy41MTQyIDE1LjUyNCAxNy41MTQyIDE1LjQzNzlWNy44NzA4M0MxNy41MTUyIDcuNzUxMDcgMTcuMzg1NiA3LjY3NjgzIDE3LjI4MTYgNy43MzYyMloiIGZpbGw9IiNGRjAwMTciLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxNSIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQgNCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K',
      value: 'csj'
    },
    {
      label: '优量汇',
      logo: '/adnetqq_logo.svg',
      value: 'adnetqq'
    }
  ];

  // 处理平台选择
  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    form.setFieldsValue({ platform: value });
  };

  // 处理App选择
  const handleAppChange = (value: number) => {
    form.setFieldsValue({ app: value });
  };

  // 处理eCPM配置选择
  const handleEcpmChange = (value: number) => {
    form.setFieldsValue({ config_id: value });
  };

  // 在组件挂载时加载eCPM配置列表
  useEffect(() => {
    fetchEcpmList({
      page: 1,
      pageSize: 100
    });
  }, [fetchEcpmList]);

  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 构造提交数据 - 不再包含bidding_type字段
      const submitData = {
        ...values
      };

      // 提交数据进行批量创建

      // 调用批量创建API
      batchCreateSlot(submitData);
    } catch {
      // 表单验证失败，不进行提交
      window.$message?.error('提交失败，请检查表单');
    }
  };

  useEffect(() => {
    if (batchCreateData?.error === null || batchCreateData?.response?.data?.code === '200') {
      window.$message?.success('批量代码位创建成功！');
      navigate('/ads-slot-manage'); // 返回上一页面
    }
  }, [batchCreateData, navigate]);

  // 处理取消按钮点击
  const handleCancel = () => {
    navigate('/ads-slot-manage');
  };

  // 表单初始化
  const initialValues = {
    platform: 'kwai'
  };

  return (
    <ACard
      bordered={false}
      title="批量创建广告平台代码位"
    >
      <ASpin spinning={batchCreateLoading}>
        <AForm
          form={form}
          initialValues={initialValues}
          layout="vertical"
          requiredMark={false}
        >
          {/* 广告平台 */}
          <AForm.Item
            label={<div className="text-16px font-medium">广告平台</div>}
            name="platform"
            rules={[{ message: '请选择广告平台', required: true }]}
          >
            <div className="w-full flex space-x-4">
              {platformOptions.map(option => (
                <div
                  key={option.value}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-md border-2 py-3 transition-all
                  ${
                    platform === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => handlePlatformChange(option.value)}
                >
                  <img
                    alt={option.label}
                    className="mr-2 h-6 w-6 object-contain"
                    src={option.logo}
                  />
                  <span
                    className={`text-16px ${platform === option.value ? 'font-medium text-primary' : 'text-gray-700'}`}
                  >
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </AForm.Item>

          {/* 选择App */}
          <AForm.Item
            label={<div className="text-16px font-medium">选择App</div>}
            name="app"
            rules={[{ message: '请选择App', required: true }]}
          >
            <ASelect
              showSearch
              className="text-16px"
              dropdownStyle={{ maxHeight: '400px' }}
              labelInValue={false}
              loading={appsLoading}
              optionLabelProp="label"
              placeholder="请选择App"
              size="large"
              style={{ height: '50px', width: '100%' }}
              filterOption={(input: string, option) => {
                const label = option?.label as string;
                return label.toLowerCase().includes(input.toLowerCase());
              }}
              onChange={handleAppChange}
            >
              {(apps?.data?.list || []).map(item => (
                <ASelect.Option
                  key={item.id}
                  label={item.app_name}
                  value={item.id}
                >
                  <div className="flex items-center">
                    <div className="mr-2 h-6 w-6 flex items-center justify-center rounded-md bg-primary/10">
                      <div className="i-carbon:application text-primary" />
                    </div>
                    {item.app_name}
                  </div>
                </ASelect.Option>
              ))}
            </ASelect>
          </AForm.Item>

          {/* 选择代码位配置 */}
          <AForm.Item
            label={<div className="text-16px font-medium">选择代码位配置</div>}
            name="config_id"
            rules={[{ message: '请选择代码位配置', required: true }]}
            tooltip="选择应用于批量创建的eCPM配置"
          >
            <ASelect
              showSearch
              className="text-16px"
              dropdownStyle={{ maxHeight: '400px' }}
              labelInValue={false}
              loading={ecpmLoading}
              optionLabelProp="label"
              placeholder="请选择eCPM配置"
              size="large"
              style={{ height: '50px', width: '100%' }}
              filterOption={(input: string, option) => {
                const label = option?.label as string;
                return label.toLowerCase().includes(input.toLowerCase());
              }}
              onChange={handleEcpmChange}
            >
              {(ecpmList?.data?.list || []).map(item => (
                <ASelect.Option
                  key={item.id}
                  label={`配置 #${item.id}`}
                  value={item.id}
                >
                  <div className="flex items-center">
                    <div className="mr-2 h-6 w-6 flex items-center justify-center rounded-md bg-primary/10">
                      <div className="i-carbon:chart-line text-primary" />
                    </div>
                    {`配置 #${item.id}`}
                  </div>
                </ASelect.Option>
              ))}
            </ASelect>
          </AForm.Item>

          {/* 配置说明 */}
          <div className="mb-8 mt-4 rounded-md bg-gray-50 p-4">
            <div className="mb-2 text-16px font-medium">批量创建说明</div>
            <ul className="list-disc pl-5 text-gray-600">
              <li>选择广告平台、App和代码位配置后，系统将自动为您创建多个代码位</li>
              <li>批量创建的代码位将应用相同的eCPM配置</li>
              <li>创建完成后，您可以在代码位管理页面查看和编辑</li>
              <li>
                如需单独创建代码位，请使用
                <AButton
                  className="p-0"
                  type="link"
                  onClick={() => navigate('/ads-slot-manage/create')}
                >
                  单个创建
                </AButton>
                功能
              </li>
            </ul>
          </div>

          {/* 表单按钮 */}
          <AForm.Item className="mt-8 flex justify-end">
            <AButton
              className="mr-4"
              type="primary"
              onClick={handleSubmit}
            >
              <div className="i-carbon:batch-job mr-1" />
              批量创建
            </AButton>
            <AButton onClick={handleCancel}>
              <div className="i-carbon:close mr-1" />
              取消
            </AButton>
          </AForm.Item>
        </AForm>
      </ASpin>
    </ACard>
  );
}
