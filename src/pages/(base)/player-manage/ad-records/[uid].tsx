import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRoute } from '@/features/router';
import { fetchGetPlayerAdRecords, fetchGetPlayerDetail } from '@/service/api';

const PlayerAdRecords = () => {
  const route = useRoute();
  const navigate = useNavigate();
  const uid = Array.isArray(route.params.uid) ? route.params.uid[0] : route.params.uid;

  const [adRecords, setAdRecords] = useState<Api.Report.Ad_Record[]>([]);
  const [allAdRecords, setAllAdRecords] = useState<Api.Report.Ad_Record[]>([]);
  const [playerDetail, setPlayerDetail] = useState<Api.Player.Detail | null>(null);
  const [searchForm] = AForm.useForm();

  // 获取玩家详情
  const { loading: detailLoading, run: getPlayerDetail } = useRequest(fetchGetPlayerDetail, {
    manual: true,
    onError: () => {
      window.$message?.error('获取玩家详情失败');
    },
    onSuccess: res => {
      if (res?.data) {
        setPlayerDetail(res.data);
      }
    }
  });

  // 获取广告记录
  const { loading: recordsLoading, run: getAdRecords } = useRequest(fetchGetPlayerAdRecords, {
    manual: true,
    onError: () => {
      window.$message?.error('获取广告记录失败');
      setAdRecords([]);
      setAllAdRecords([]);
    },
    onSuccess: res => {
      if (res?.data?.list) {
        const records = Array.isArray(res.data.list) ? res.data.list : [];
        setAllAdRecords(records);
        setAdRecords(records);
      } else {
        setAdRecords([]);
        setAllAdRecords([]);
      }
    }
  });

  // 获取数据
  useEffect(() => {
    if (!uid) return;

    // 并行获取玩家详情和广告记录
    getPlayerDetail(uid);
    getAdRecords(uid);
  }, [uid, getPlayerDetail, getAdRecords]);

  const loading = detailLoading || recordsLoading;

  // 筛选数据
  const handleFilter = () => {
    const values = searchForm.getFieldsValue();
    let filteredData = [...allAdRecords];

    // 时间范围筛选
    if (values.timeRange) {
      let startTime: dayjs.Dayjs | undefined;
      if (values.timeRange === 'today') {
        startTime = dayjs().startOf('day');
      } else if (values.timeRange === 'week') {
        startTime = dayjs().subtract(7, 'days').startOf('day');
      }

      if (startTime) {
        filteredData = filteredData.filter(record => {
          const recordTime = dayjs(Number.parseInt(record.vad_time, 10) * 1000);
          return recordTime.isAfter(startTime);
        });
      }
    }

    // 广告类型筛选
    if (values.adType) {
      filteredData = filteredData.filter(record => record.ad_type === values.adType);
    }

    setAdRecords(filteredData);
  };

  // 重置筛选
  const handleReset = () => {
    searchForm.resetFields();
    setAdRecords(allAdRecords);
  };

  const columns = [
    {
      render: (_: unknown, __: unknown, index: number) => index + 1,
      title: '序号',
      width: 60
    },
    {
      dataIndex: 'ad_id',
      key: 'ad_id',
      title: '广告ID',
      width: 120
    },
    {
      dataIndex: 'ad_type',
      key: 'ad_type',
      title: '广告类型',
      width: 100
    },
    {
      dataIndex: 'ad_platform',
      key: 'ad_platform',
      title: '广告平台',
      width: 100
    },
    {
      dataIndex: 'game_name',
      key: 'game_name',
      title: '游戏名称',
      width: 120
    },
    {
      dataIndex: 'ecpm',
      key: 'ecpm',
      render: (ecpm: number) => ecpm.toFixed(4),
      title: 'eCPM',
      width: 100
    },
    {
      dataIndex: 'discount_ecpm',
      key: 'discount_ecpm',
      render: (discountEcpm: number) => discountEcpm.toFixed(4),
      title: '折扣eCPM',
      width: 120
    },
    {
      dataIndex: 'vad_time',
      key: 'vad_time',
      render: (time: string) => {
        const timestamp = Number.parseInt(time, 10);
        return dayjs(timestamp * 1000).format('MM-DD HH:mm:ss');
      },
      title: '广告展示时间',
      width: 150
    }
  ];

  // 如果没有uid，显示无权限访问页面
  if (!uid) {
    return (
      <div className="p-4">
        <ACard>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 text-6xl">🚫</div>
            <h2 className="mb-2 text-2xl text-gray-800 font-semibold">无权限访问</h2>
            <p className="mb-6 text-center text-gray-500">缺少必要的玩家UID参数，无法访问该页面</p>
            <AButton
              icon={<div className="i-carbon:arrow-left" />}
              type="primary"
              onClick={() => navigate('/player-manage')}
            >
              返回玩家管理
            </AButton>
          </div>
        </ACard>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ACard className="mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="mb-3 text-lg font-semibold">广告观看记录</h2>

            {/* 第一行：基本信息 */}
            <div className="mb-2 flex items-center gap-6">
              <span className="text-gray-500">
                玩家UID: <span className="text-gray-800 font-medium">{uid}</span>
              </span>
              <span className="text-gray-500">
                应用渠道: <span className="text-gray-800 font-medium">{playerDetail?.app_chan_name || '-'}</span>
              </span>
              <span className="text-gray-500">
                APP: <span className="text-gray-800 font-medium">{playerDetail?.app_name || '-'}</span>
              </span>
              <span className="text-gray-500">
                主体: <span className="text-gray-800 font-medium">{playerDetail?.entity_name || '-'}</span>
              </span>
            </div>

            {/* 第二行：广告统计 */}
            <div className="flex items-center gap-6">
              <span className="text-gray-500">
                广告总数: <span className="text-blue-600 font-medium">{allAdRecords.length}</span>
              </span>
              <span className="text-gray-500">
                平台数量:{' '}
                <span className="text-green-600 font-medium">{new Set(allAdRecords.map(r => r.ad_platform)).size}</span>
              </span>
              <span className="text-gray-500">
                广告类型数:{' '}
                <span className="text-orange-600 font-medium">{new Set(allAdRecords.map(r => r.ad_type)).size}</span>
              </span>
              <span className="text-gray-500">
                总收益:{' '}
                <span className="text-purple-600 font-medium">
                  {allAdRecords.reduce((sum, r) => sum + r.ecpm, 0).toFixed(4)}
                </span>
              </span>
            </div>
          </div>

          <AButton
            icon={<div className="i-carbon:arrow-left" />}
            onClick={() => navigate('/player-manage')}
          >
            返回玩家列表
          </AButton>
        </div>
      </ACard>

      <ACard className="mb-4">
        <AForm
          form={searchForm}
          layout="inline"
        >
          <div className="flex flex-wrap gap-4">
            <AForm.Item
              label="时间范围"
              name="timeRange"
            >
              <ASelect
                allowClear
                placeholder="请选择时间范围"
                style={{ width: 150 }}
                options={[
                  { label: '今日', value: 'today' },
                  { label: '最近7天', value: 'week' }
                ]}
              />
            </AForm.Item>

            <AForm.Item
              label="广告类型"
              name="adType"
            >
              <ASelect
                allowClear
                placeholder="请选择广告类型"
                style={{ width: 150 }}
                options={Array.from(new Set(allAdRecords.map(r => r.ad_type))).map(type => ({
                  label: type,
                  value: type
                }))}
              />
            </AForm.Item>

            <AForm.Item>
              <ASpace>
                <AButton
                  icon={<div className="i-carbon:search" />}
                  type="primary"
                  onClick={handleFilter}
                >
                  筛选
                </AButton>
                <AButton
                  icon={<div className="i-carbon:reset" />}
                  onClick={handleReset}
                >
                  重置
                </AButton>
              </ASpace>
            </AForm.Item>
          </div>
        </AForm>
      </ACard>

      <ACard>
        <ATable
          columns={columns}
          dataSource={adRecords}
          loading={loading}
          rowKey="id"
          scroll={{ x: 850 }}
          locale={{
            emptyText: (
              <div className="py-8 text-center">
                <div className="mb-2 text-4xl">📊</div>
                <div className="text-gray-500">暂无广告记录</div>
              </div>
            )
          }}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </ACard>
    </div>
  );
};

export default PlayerAdRecords;
