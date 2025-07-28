import React from 'react';

interface SearchFormProps {
  readonly form: any;
  readonly loading?: boolean;
  readonly onReset: () => void;
  readonly onSearch: () => void;
}

export function SearchForm({ form, loading = false, onReset, onSearch }: SearchFormProps) {
  const handleSearch = () => {
    onSearch();
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <AForm
      form={form}
      layout="inline"
    >
      <div className="flex flex-wrap gap-4">
        <AForm.Item
          label="关键词搜索"
          name="keyword"
        >
          <AInput
            allowClear
            placeholder="请输入玩家UID或渠道ID"
            style={{ width: 200 }}
          />
        </AForm.Item>

        <AForm.Item
          label="封禁状态"
          name="is_banned"
        >
          <ASelect
            allowClear
            placeholder="请选择封禁状态"
            style={{ width: 200 }}
            options={[
              { label: '正常', value: false },
              { label: '封禁', value: true }
            ]}
          />
        </AForm.Item>

        <AForm.Item
          label="标记状态"
          name="is_marked"
        >
          <ASelect
            allowClear
            placeholder="请选择标记状态"
            style={{ width: 200 }}
            options={[
              { label: '未标记', value: false },
              { label: '已标记', value: true }
            ]}
          />
        </AForm.Item>

        <AForm.Item
          label="登录类型"
          name="login_type"
        >
          <ASelect
            allowClear
            placeholder="请选择登录类型"
            style={{ width: 200 }}
            options={[
              { label: '微信', value: '1' },
              { label: '游客', value: '2' }
            ]}
          />
        </AForm.Item>

        <AForm.Item>
          <ASpace>
            <AButton
              icon={<div className="i-carbon:search" />}
              loading={loading}
              type="primary"
              onClick={handleSearch}
            >
              搜索
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
  );
}
