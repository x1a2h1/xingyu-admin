import { useState } from 'react';

interface SearchFormProps {
  readonly loading?: boolean;
  readonly onAdd: () => void;
  readonly onSearch: (keyword: string) => void; // 添加加载状态参数
}

function SearchForm({ loading = false, onAdd, onSearch }: SearchFormProps) {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    onSearch(keyword);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 添加重置功能
  const handleReset = () => {
    setKeyword('');
    onSearch(''); // 清空搜索条件并触发查询
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <AInput
          allowClear
          placeholder="请输入渠道名称"
          style={{ width: 240 }}
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <AButton
          className="ml-2"
          loading={loading}
          type="primary"
          onClick={handleSearch}
        >
          <div className="i-carbon-search mr-1" />
          搜索
        </AButton>
        <AButton
          className="ml-2"
          onClick={handleReset}
        >
          <div className="i-carbon-reset mr-1" />
          重置
        </AButton>
      </div>
      <AButton
        type="primary"
        onClick={onAdd}
      >
        <div className="i-carbon-add mr-1" />
        新增渠道
      </AButton>
    </div>
  );
}

export default SearchForm;
