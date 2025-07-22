import { useRequest } from 'ahooks';
import type { RadioChangeEvent } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchGetAppList, fetchPostSlot } from '@/service/api';

export function SlotForm() {
  // 获取导航函数
  const navigate = useNavigate();
  // 使用AForm表单
  const [form] = AForm.useForm();
  // 为了解决选择问题，仍保留部分UI状态
  const [platform, setPlatform] = useState(form.getFieldValue('platform') || 'kwai');
  const [adType, setAdType] = useState(form.getFieldValue('adType') || 1);
  // 增加竞价方式状态
  const [biddingType, setBiddingType] = useState(form.getFieldValue('bidding_type') || 0);
  // 加载App列表
  const {
    data: apps,
    loading,
    run: _
  } = useRequest(fetchGetAppList, {
    manual: false
  });
  const { data: CreateData, run: createSlot } = useRequest(fetchPostSlot, {
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

  // 广告类型选项 - 使用URL图片插画
  const adTypeOptions = [
    {
      description: 'App推荐页，详情页中的原声图文及视频广告',
      icon: 'bg-blue-50',
      illustration: 'https://p2-ad.adkwai.com/udata/pkg/ks-ad-ssp-cdn/img/icon-feed-highlight-new.png',
      label: '信息流',
      value: 1
    },
    {
      description: '在App启动时展示的，展示时间短暂的全屏化广告形式',
      icon: 'bg-orange-50',
      illustration: 'https://p2-ad.adkwai.com/udata/pkg/ks-ad-ssp-cdn/img/icon-splash-highlight-new.png',
      label: '开屏',
      value: 2
    },
    {
      description: '观看视频换取应用内奖励。用户主动性强，视频播放完成度高',
      icon: 'bg-green-50',
      illustration: 'https://p2-ad.adkwai.com/udata/pkg/ks-ad-ssp-cdn/img/icon-reward-highlight-new.png',
      label: '激励',
      value: 3
    },
    {
      description: 'APP内场景切换时弹出的广告，可展示半屏、全屏的视频或图片',
      icon: 'bg-purple-50',
      illustration: 'https://p2-ad.adkwai.com/udata/pkg/ks-ad-ssp-cdn/img/icon-interstitial-highlight-new.png',
      label: '新插屏',
      value: 4
    }
  ];

  // 竞价方式选项
  const bidTypeOptions = [
    { label: '目标eCPM', value: 0 },
    { label: '实时竞价', value: 1 }
  ];

  // 处理广告类型选择
  const handleAdTypeChange = (value: number) => {
    setAdType(value);
    form.setFieldsValue({ adType: value });
  };

  // 处理平台选择
  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    form.setFieldsValue({ platform: value });
  };

  // 处理竞价方式选择
  const handleBidTypeChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setBiddingType(value);
    form.setFieldsValue({ bidding_type: value });
  };

  // 处理App选择
  const handleAppChange = (value: number) => {
    form.setFieldsValue({ app: value });
  };

  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 将adType转换为type
      const submitData = {
        ...values,
        // 将adType转换为type，已经是数字类型，不需要转换
        bidding_type: values.bidding_type,
        type: values.adType
      };

      // 移除submitData中的adType
      delete submitData.adType;

      // 提交数据进行单个创建

      // 这里可以添加表单提交逻辑
      // const result = await submitFormData(submitData);

      createSlot(submitData);
    } catch {
      // 表单验证失败，不进行提交
      window.$message?.error('提交失败，请检查表单');
    }
  };
  useEffect(() => {
    if (CreateData?.error === null || CreateData?.response.data.code === '200') {
      window.$message?.success('代码位创建成功！');
      navigate('/ads-slot-manage'); // 返回上一页面
    }
  }, [CreateData, navigate]);

  // 处理取消按钮点击
  const handleCancel = () => {
    navigate('/ads-slot-manage');
  };

  // 表单初始化
  const initialValues = {
    adType: 1,
    bidding_type: 0,
    ecpm: 0,
    platform: 'kwai' // 添加目标eCPM初始值
  };

  return (
    <ACard
      bordered={false}
      title="创建广告平台代码位"
    >
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

        {/* 广告类型 */}
        <AForm.Item
          label={<div className="text-16px font-medium">广告类型</div>}
          name="adType"
          rules={[{ message: '请选择广告类型', required: true }]}
        >
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {adTypeOptions.map(option => (
              <div
                key={option.value}
                className={`flex cursor-pointer overflow-hidden rounded-lg border-2 transition-all
                  ${adType === option.value ? 'border-primary' : 'border-gray-200 hover:border-primary/50'}`}
                onClick={() => handleAdTypeChange(option.value)}
              >
                <div className={`flex h-full w-24 items-center justify-center ${option.icon}`}>
                  <img
                    alt={option.label}
                    className="h-12 w-12 object-contain"
                    src={option.illustration}
                  />
                </div>
                <div className="flex flex-col flex-1 justify-center p-4">
                  <div
                    className={`text-16px font-medium ${adType === option.value ? 'text-primary' : 'text-gray-800'}`}
                  >
                    {option.label}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{option.description}</div>
                </div>
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
            loading={loading}
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

        {/* 竞价方式 */}
        <AForm.Item
          label={<div className="text-16px font-medium">竞价方式</div>}
          name="bidding_type"
          rules={[{ message: '请选择竞价方式', required: true }]}
        >
          <ARadio.Group
            buttonStyle="solid"
            options={bidTypeOptions}
            optionType="button"
            onChange={handleBidTypeChange}
          />
        </AForm.Item>

        {/* 目标eCPM */}
        {biddingType === 0 && (
          <AForm.Item
            label={<div className="text-16px font-medium">目标eCPM</div>}
            name="ecpm"
            rules={[{ message: '请输入目标eCPM值', required: true }]}
          >
            <AInputNumber
              className="w-64"
              min={0}
              placeholder="请输入目标eCPM值"
              precision={2}
              size="middle"
              step={0.5}
            />
          </AForm.Item>
        )}

        {/* 表单按钮 */}
        <AForm.Item className="mt-8 flex justify-end">
          <AButton
            className="mr-4"
            type="primary"
            onClick={handleSubmit}
          >
            <div className="i-carbon:checkmark mr-1" />
            创建
          </AButton>
          <AButton onClick={handleCancel}>
            <div className="i-carbon:close mr-1" />
            取消
          </AButton>
        </AForm.Item>
      </AForm>
    </ACard>
  );
}
