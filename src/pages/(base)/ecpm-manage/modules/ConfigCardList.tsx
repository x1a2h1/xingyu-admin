interface ConfigCardListProps {
  readonly configList: Api.ECPM.Info[];
  readonly loading?: boolean;
  readonly onDelete: (id: number) => void;
  readonly onView: (id: number) => void;
}

export function ConfigCardList({ configList, loading = false, onDelete, onView }: ConfigCardListProps) {
  // 删除确认
  const handleDeleteConfirm = (id: number) => {
    window.$modal?.confirm({
      cancelText: '取消',
      content: '您确定要删除此配置吗？删除后无法恢复。',
      okText: '确认',
      onOk: () => onDelete(id),
      title: '确认删除'
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
      {loading ? (
        <div className="col-span-full flex justify-center py-8">
          <ASpin size="large" />
        </div>
      ) : (
        <>
          {configList.map(config => (
            <ACard
              className="w-full border-0 rounded-xl bg-white hover:border hover:border-primary/60"
              key={config.id}
              bodyStyle={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 160,
                padding: '24px 20px 18px 20px'
              }}
            >
              <div className="mb-4 flex flex-col items-center">
                <div className="mb-2 text-2xl text-primary font-bold tracking-wide">表{config.id}</div>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-500">
                    配置项数
                    <span className="ml-1 rounded bg-gray-100 px-2 py-0.5 text-base text-gray-700 font-semibold">
                      {config.ecpm_entries?.length || 0}
                    </span>
                  </span>
                  <span className="text-gray-400">
                    创建时间
                    <span className="ml-1 text-gray-600">{config.create_time}</span>
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <AButton
                  className="rounded-full px-4"
                  size="small"
                  type="primary"
                  onClick={() => onView(config.id)}
                >
                  <div className="i-carbon:view mr-1" />
                  查看
                </AButton>
                <AButton
                  danger
                  className="rounded-full px-4"
                  size="small"
                  type="primary"
                  onClick={() => handleDeleteConfirm(config.id)}
                >
                  <div className="i-carbon:trash-can mr-1" />
                  删除
                </AButton>
              </div>
            </ACard>
          ))}
          {configList.length === 0 && (
            <div className="col-span-full">
              <AEmpty description="暂无eCPM配置数据" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
