import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PlayerTableProps {
  readonly dataSource: Api.Player.Info[];
  readonly loading?: boolean;
  readonly onBanPlayer: (player: Api.Player.Info, reason: string) => void;
  readonly onChange?: (pagination: { current: number; pageSize: number }) => void;
  readonly onUnbanPlayer: (player: Api.Player.Info) => void;
  readonly pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
}

interface BanModalState {
  player: Api.Player.Info | null;
  visible: boolean;
}

interface BanDetailModalState {
  player: Api.Player.Info | null;
  visible: boolean;
}

export function PlayerTable({
  dataSource,
  loading = false,
  onBanPlayer,
  onChange,
  onUnbanPlayer,
  pagination
}: PlayerTableProps) {
  const navigate = useNavigate();

  const [banModal, setBanModal] = useState<BanModalState>({
    player: null,
    visible: false
  });

  const [banDetailModal, setBanDetailModal] = useState<BanDetailModalState>({
    player: null,
    visible: false
  });

  const [banForm] = AForm.useForm();

  const handleBan = (player: Api.Player.Info) => {
    setBanModal({
      player,
      visible: true
    });
  };

  const handleBanConfirm = () => {
    banForm.validateFields().then(values => {
      if (banModal.player) {
        onBanPlayer(banModal.player, values.reason);
        setBanModal({ player: null, visible: false });
        banForm.resetFields();
      }
    });
  };

  const handleBanCancel = () => {
    setBanModal({ player: null, visible: false });
    banForm.resetFields();
  };

  const handleShowBanDetail = (player: Api.Player.Info) => {
    setBanDetailModal({
      player,
      visible: true
    });
  };

  const handleBanDetailCancel = () => {
    setBanDetailModal({ player: null, visible: false });
  };

  const handleViewAdRecords = (player: Api.Player.Info) => {
    navigate(`/player-manage/ad-records/${player.uid}`);
  };
  const columns = [
    {
      render: (_: unknown, __: unknown, index: number) => index + 1,
      title: '序号',
      width: 60
    },
    {
      dataIndex: 'uid',
      key: 'uid',
      title: '玩家UID',
      width: 120
    },
    {
      dataIndex: 'channel_id',
      key: 'channel_id',
      title: '渠道ID',
      width: 100
    },
    {
      dataIndex: 'login_type',
      key: 'login_type',
      render: (loginType: string) => {
        const typeMap = {
          '1': '微信',
          '2': '游客'
        };
        return typeMap[loginType as keyof typeof typeMap] || loginType;
      },
      title: '登录类型',
      width: 100
    },
    {
      dataIndex: 'user_level',
      key: 'user_level',
      render: (level: number) => {
        let color = 'default';
        if (level >= 3) {
          color = 'red';
        } else if (level >= 2) {
          color = 'gold';
        } else if (level >= 1) {
          color = 'green';
        }
        return <ATag color={color}>LV.{level}</ATag>;
      },
      title: '用户等级',
      width: 100
    },
    {
      dataIndex: 'total_coins',
      key: 'total_coins',
      render: (totalCoins: string) => {
        const value = Number.parseFloat(totalCoins || '0');
        return `¥${value.toFixed(2)}`;
      },
      sorter: (a: Api.Player.Info, b: Api.Player.Info) =>
        Number.parseFloat(a.total_coins || '0') - Number.parseFloat(b.total_coins || '0'),
      title: '历史金币总和',
      width: 130
    },
    {
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: string) => {
        const value = Number.parseFloat(balance || '0');
        return `¥${value.toFixed(2)}`;
      },
      sorter: (a: Api.Player.Info, b: Api.Player.Info) =>
        Number.parseFloat(a.balance || '0') - Number.parseFloat(b.balance || '0'),
      title: '玩家余额',
      width: 100
    },
    {
      dataIndex: 'withdrawal_total',
      key: 'withdrawal_total',
      render: (withdrawalTotal: string) => {
        const value = Number.parseFloat(withdrawalTotal || '0');
        return `¥${value.toFixed(2)}`;
      },
      title: '提现总和',
      width: 100
    },
    {
      dataIndex: 'last_login_time',
      key: 'last_login_time',
      render: (time: string) => {
        if (!time) return '-';
        const timestamp = Number.parseInt(time, 10);
        return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
      sorter: (a: Api.Player.Info, b: Api.Player.Info) =>
        Number.parseInt(a.last_login_time || '0', 10) - Number.parseInt(b.last_login_time || '0', 10),
      title: '最近登录',
      width: 150
    },
    {
      dataIndex: 'is_marked',
      key: 'is_marked',
      render: (isMarked: boolean) => (
        <ATag color={isMarked ? 'warning' : 'default'}>{isMarked ? '已标记' : '未标记'}</ATag>
      ),
      title: '标记状态',
      width: 100
    },
    {
      dataIndex: 'is_banned',
      key: 'is_banned',
      render: (banned: boolean, record: Api.Player.Info) => {
        if (banned) {
          return (
            <ATag
              color="error"
              style={{ cursor: 'pointer' }}
              onClick={() => handleShowBanDetail(record)}
            >
              封禁
            </ATag>
          );
        }
        return <ATag color="success">正常</ATag>;
      },
      title: '封禁状态',
      width: 100
    },
    {
      key: 'action',
      render: (_: unknown, record: Api.Player.Info) => (
        <ASpace
          direction="vertical"
          size="small"
        >
          <ASpace>
            {record.is_banned ? (
              <AButton
                size="small"
                type="link"
                onClick={() => onUnbanPlayer(record)}
              >
                解封
              </AButton>
            ) : (
              <AButton
                danger
                size="small"
                type="link"
                onClick={() => handleBan(record)}
              >
                封禁
              </AButton>
            )}
          </ASpace>
          <AButton
            size="small"
            type="link"
            onClick={() => handleViewAdRecords(record)}
          >
            查看广告记录
          </AButton>
        </ASpace>
      ),
      title: '操作',
      width: 120
    }
  ];

  return (
    <>
      <ATable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1320 }}
        pagination={
          pagination
            ? {
                current: pagination.current,
                onChange: (page, pageSize) => {
                  onChange?.({ current: page, pageSize });
                },
                pageSize: pagination.pageSize,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                total: pagination.total
              }
            : false
        }
      />

      <AModal
        cancelText="取消"
        okText="确认封禁"
        open={banModal.visible}
        title={`封禁玩家: ${banModal.player?.uid || ''}`}
        onCancel={handleBanCancel}
        onOk={handleBanConfirm}
      >
        <AForm
          form={banForm}
          layout="vertical"
        >
          <AForm.Item
            label="封禁原因"
            name="reason"
            rules={[{ message: '请输入封禁原因', required: true }]}
          >
            <AInput.TextArea
              showCount
              maxLength={200}
              placeholder="请输入封禁原因"
              rows={4}
            />
          </AForm.Item>
        </AForm>
      </AModal>

      <AModal
        open={banDetailModal.visible}
        title="封禁详情"
        width={500}
        footer={[
          <AButton
            key="close"
            onClick={handleBanDetailCancel}
          >
            关闭
          </AButton>
        ]}
        onCancel={handleBanDetailCancel}
      >
        {banDetailModal.player && (
          <div className="space-y-4">
            <div>
              <span className="text-gray-600 font-medium">玩家UID：</span>
              <span className="ml-2">{banDetailModal.player.uid}</span>
            </div>

            <div>
              <span className="text-gray-600 font-medium">封禁时间：</span>
              <span className="ml-2">
                {banDetailModal.player.ban_update_time
                  ? dayjs(Number.parseInt(banDetailModal.player.ban_update_time, 10) * 1000).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )
                  : '-'}
              </span>
            </div>

            <div>
              <span className="text-gray-600 font-medium">封禁原因：</span>
              <div className="mt-2 border rounded bg-gray-50 p-3">
                {banDetailModal.player.ban_reason || '暂无封禁原因'}
              </div>
            </div>
          </div>
        )}
      </AModal>
    </>
  );
}
