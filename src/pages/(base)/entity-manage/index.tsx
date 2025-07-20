import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { fetchCreateEntify, fetchGetEntifyList, fetchUpdateEntify } from '@/service/api';

import { EntityFormModal } from './modules/EntityFormModal';
import { EntityTable } from './modules/EntityTable';
import type { EntityItem } from './modules/types';

export default function EntityManage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentEntity, setCurrentEntity] = useState<Partial<EntityItem> | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: resp,
    loading,
    run: getList
  } = useRequest(fetchGetEntifyList, {
    manual: true
  });

  // 处理搜索
  const init = async () => {
    await getList({
      keyword: searchKeyword
    });
  };

  useEffect(() => {
    init();
  }, [searchKeyword]);

  // 处理搜索
  const handleSearch = () => {
    init();
  };

  // 处理新增
  const handleAdd = () => {
    setModalMode('add');
    setCurrentEntity(undefined);
    setModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: EntityItem) => {
    setModalMode('edit');
    setCurrentEntity(record);
    setModalVisible(true);
  };

  // 处理表单提交
  const handleModalSubmit = async (values: Partial<EntityItem>) => {
    try {
      setSubmitting(true);

      if (modalMode === 'add') {
        // 调用创建实体API
        await fetchCreateEntify({
          domain: values.domain,
          name: values.name
        });
        window?.$message?.success('创建公司成功');
      } else {
        // 调用更新实体API
        if (!currentEntity?.id) {
          throw new Error('缺少实体ID');
        }
        await fetchUpdateEntify(String(currentEntity.id), {
          domain: values.domain,
          name: values.name
        });
        window?.$message?.success('更新公司成功');
      }

      setModalVisible(false);
      init(); // 刷新列表
    } catch (error) {
      const action = modalMode === 'add' ? '创建' : '更新';
      const errorMessage = error instanceof Error ? error.message : `${action}公司失败`;
      window?.$message?.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <ACard className="mb-4">
        <ASpace size="middle">
          <AInput
            className="w-250px"
            placeholder="请输入搜索关键词"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            onPressEnter={handleSearch}
          />
          <AButton
            icon={<SearchOutlined />}
            loading={loading}
            type="primary"
            onClick={handleSearch}
          >
            搜索
          </AButton>
          <AButton
            icon={<PlusOutlined />}
            type="primary"
            onClick={handleAdd}
          >
            新增
          </AButton>
        </ASpace>
      </ACard>

      <EntityTable
        data={resp?.data || undefined}
        loading={loading}
        onEdit={handleEdit}
        onRefresh={init}
      />

      <EntityFormModal
        initialValues={currentEntity}
        loading={submitting}
        mode={modalMode}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
