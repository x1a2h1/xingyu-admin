import { useRequest } from '@sa/hooks';
import { useState } from 'react';

import { fetchSaveECPM } from '@/service/api/ecpm';

interface ConfigDetailProps {
  readonly config: Api.ECPM.Info;
  readonly onBack: () => void;
}

export function ConfigDetail({ config, onBack }: ConfigDetailProps) {
  const [editMode, setEditMode] = useState(false);
  const [editRows, setEditRows] = useState<Api.ECPM.ECPMEntry[]>([]);

  const { run: saveECPM } = useRequest(fetchSaveECPM, {
    manual: true,
    onError: () => {
      window.$message?.error('保存失败');
    },
    onSuccess: () => {
      setEditMode(false);
      setEditRows([]);
      window.$message?.success('保存成功');
      onBack();
    }
  });

  // 进入编辑模式时初始化编辑数据
  const handleEdit = () => {
    // 确保即使ecpm_entries为空也能添加一个空行开始编辑
    setEditRows([...(config.ecpm_entries || []), getEmptyRow()]);
    setEditMode(true);
  };

  // 退出编辑模式
  const handleCancel = () => {
    setEditMode(false);
    setEditRows([]);
  };

  // 保存编辑
  const handleSave = () => {
    // 过滤掉无效行（至少要有广告类型和eCPM值）
    const validRows = editRows.filter(
      row => row.ad_type !== undefined && row.ecpm !== undefined && Number(row.ad_type) > 0 && Number(row.ecpm) >= 0
    );

    const params = { ecpm_entries: validRows };
    saveECPM(config.id, params);
  };

  // 编辑表格行内容
  const handleRowChange = (idx: number, key: string, value: number) => {
    const newRows = [...editRows];

    // 处理特殊情况：当bid_type为1(实时竞价)时，自动设置ecpm为1并禁用
    if (key === 'bid_type' && value === 1) {
      newRows[idx] = { ...newRows[idx], ecpm: 1, [key]: value };
    } else {
      newRows[idx] = { ...newRows[idx], [key]: value };
    }

    // 如果最后一行被填写，自动追加新空行
    if (idx === editRows.length - 1 && value) {
      const last = newRows[newRows.length - 1];
      if (last.ad_type || last.bid_type || last.ecpm) {
        newRows.push(getEmptyRow());
      }
    }
    setEditRows(newRows);
  };

  // 删除某一行
  const handleRemoveRow = (idx: number) => {
    const newRows = editRows.filter((_, i) => i !== idx);
    setEditRows(newRows);
  };

  function getEmptyRow(): Api.ECPM.ECPMEntry {
    return {
      ad_type: 0,
      bid_type: 0,
      ecpm: 0
    };
  }

  if (!config) {
    return (
      <AResult
        status="warning"
        title="无法加载配置数据"
        extra={
          <AButton
            type="primary"
            onClick={onBack}
          >
            返回列表
          </AButton>
        }
      />
    );
  }

  // 通用列定义 - 序号列
  const indexColumn = {
    key: 'index',
    render: (_: unknown, __: unknown, index?: number) => (index ?? 0) + 1,
    title: '序号',
    width: 80
  };

  // 编辑模式下的列
  const editColumns = [
    indexColumn,
    {
      dataIndex: 'ad_type',
      key: 'ad_type',
      render: (value: number, _: unknown, idx: number) => (
        <ASelect
          placeholder="请选择广告类型"
          style={{ minWidth: 100 }}
          value={value}
          onChange={v => handleRowChange(idx, 'ad_type', v)}
        >
          <ASelect.Option value={1}>信息流</ASelect.Option>
          <ASelect.Option value={2}>开屏</ASelect.Option>
          <ASelect.Option value={3}>激励视频</ASelect.Option>
          <ASelect.Option value={4}>插屏</ASelect.Option>
        </ASelect>
      ),
      title: '广告类型'
    },
    {
      dataIndex: 'bid_type',
      key: 'bid_type',
      render: (value: number, _: unknown, idx: number) => (
        <ASelect
          placeholder="请选择竞价方式"
          style={{ minWidth: 80 }}
          value={value}
          onChange={v => handleRowChange(idx, 'bid_type', v)}
        >
          <ASelect.Option value={0}>标准</ASelect.Option>
          <ASelect.Option value={1}>实时竞价</ASelect.Option>
        </ASelect>
      ),
      title: '竞价方式'
    },
    {
      dataIndex: 'ecpm',
      key: 'ecpm',
      render: (value: number, record: Api.ECPM.ECPMEntry, idx: number) => (
        <AInputNumber
          disabled={record.bid_type === 1}
          placeholder="请输入eCPM"
          style={{ width: '100%' }}
          value={value || 0}
          onChange={v => handleRowChange(idx, 'ecpm', v ?? 0)}
        />
      ),
      title: 'eCPM'
    },
    {
      key: 'action',
      render: (_: any, __: any, idx: number) =>
        editRows.length > 1 && idx !== editRows.length - 1 ? (
          <AButton
            danger
            size="small"
            type="link"
            onClick={() => handleRemoveRow(idx)}
          >
            <div className="i-carbon:subtract" />
          </AButton>
        ) : null,
      title: '操作',
      width: 80
    }
  ];

  // 普通模式下的列
  const columns = [
    indexColumn,
    {
      dataIndex: 'ad_type',
      key: 'ad_type',
      render: (value: number) => {
        const adTypeMap: Record<number, string> = {
          1: '信息流',
          2: '开屏',
          3: '激励视频',
          4: '插屏'
        };
        return adTypeMap[value] || `未知(${value})`;
      },
      title: '广告类型'
    },
    {
      dataIndex: 'bid_type',
      key: 'bid_type',
      render: (value: number) => {
        const bidTypeMap: Record<number, string> = {
          0: '标准',
          1: '实时竞价'
        };
        return bidTypeMap[value] || `未知(${value})`;
      },
      title: '竞价方式'
    },
    {
      dataIndex: 'ecpm',
      key: 'ecpm',
      render: (value: number) => {
        // 根据eCPM值设置不同颜色
        let color = 'default';
        if (value >= 1000) color = 'purple';
        else if (value >= 500) color = 'blue';
        else if (value >= 100) color = 'cyan';
        else if (value >= 50) color = 'green';

        return <ATag color={color}>{value}</ATag>;
      },
      title: 'eCPM'
    }
  ];

  return (
    <>
      <ACard className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AButton
              className="mr-4"
              icon={<div className="i-carbon:arrow-left" />}
              type="primary"
              onClick={onBack}
            >
              返回
            </AButton>
            <div className="text-lg font-medium">表{config.id} - 详细配置</div>
          </div>
          {!editMode ? (
            <AButton
              icon={<div className="i-carbon:edit" />}
              type="primary"
              onClick={handleEdit}
            >
              编辑
            </AButton>
          ) : (
            <ASpace>
              <AButton
                icon={<div className="i-carbon:save" />}
                type="primary"
                onClick={handleSave}
              >
                保存
              </AButton>
              <AButton onClick={handleCancel}>取消</AButton>
            </ASpace>
          )}
        </div>
      </ACard>
      <ACard style={{ padding: 0 }}>
        <ATable
          bordered
          columns={editMode ? editColumns : columns}
          dataSource={editMode ? editRows : (config.ecpm_entries ?? [])}
          pagination={false}
          rowKey={(_, index) => (index ?? 0).toString()}
        />
      </ACard>
    </>
  );
}
