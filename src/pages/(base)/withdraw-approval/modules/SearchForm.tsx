import type { FormInstance } from 'antd';

import { fetchGetMyAppList } from '@/service/api/application';
import { fetchGetEntifyList } from '@/service/api/entity';

interface SearchFormProps {
  form: FormInstance;
  loading?: boolean;
  onReset: () => void;
  onSearch: () => void;
}

export const SearchForm = ({ form, loading, onReset, onSearch }: SearchFormProps) => {
  const [appList, setAppList] = useState<Api.Application.Info[]>([]);
  const [entityList, setEntityList] = useState<Api.Entity.Entity[]>([]);
  const [appLoading, setAppLoading] = useState(false);
  const [entityLoading, setEntityLoading] = useState(false);

  // 获取应用列表
  useEffect(() => {
    const fetchApps = async () => {
      setAppLoading(true);
      try {
        const response = await fetchGetMyAppList({ page: 1, pageSize: 1000 });
        setAppList(response.data?.list || []);
      } catch {
        setAppList([]);
      } finally {
        setAppLoading(false);
      }
    };
    fetchApps();
  }, []);

  // 获取实体列表
  useEffect(() => {
    const fetchEntities = async () => {
      setEntityLoading(true);
      try {
        const response = await fetchGetEntifyList({ page: 1, pageSize: 1000 });
        setEntityList(response.data?.list || []);
      } catch {
        setEntityList([]);
      } finally {
        setEntityLoading(false);
      }
    };
    fetchEntities();
  }, []);

  return (
    <ACard>
      <AForm
        form={form}
        layout="inline"
        onFinish={onSearch}
      >
        <AForm.Item
          label="关键字"
          name="keyword"
        >
          <AInput
            allowClear
            placeholder="请输入关键字搜索"
            style={{ width: 200 }}
          />
        </AForm.Item>

        <AForm.Item
          label="状态"
          name="status"
        >
          <ASelect
            allowClear
            placeholder="请选择状态"
            style={{ width: 140 }}
            options={[
              { label: '待审批', value: 'pending' },
              { label: '已批准', value: 'approved' },
              { label: '已支付', value: 'paid' },
              { label: '已驳回', value: 'rejected' },
              { label: '支付失败', value: 'failed' }
            ]}
          />
        </AForm.Item>

        <AForm.Item
          label="支付平台"
          name="platform"
        >
          <ASelect
            allowClear
            placeholder="请选择平台"
            style={{ width: 120 }}
            options={[
              { label: '支付宝', value: 'alipay' },
              { label: '微信支付', value: 'wechatpay' }
            ]}
          />
        </AForm.Item>

        <AForm.Item
          label="应用"
          name="app_id"
        >
          <ASelect
            allowClear
            showSearch
            loading={appLoading}
            placeholder="请选择应用"
            style={{ width: 180 }}
            filterOption={(input, option) =>
              String(option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={appList.map((app: Api.Application.Info) => ({
              label: app.app_name,
              value: app.id
            }))}
          />
        </AForm.Item>

        <AForm.Item
          label="公司主体"
          name="entity_id"
        >
          <ASelect
            allowClear
            showSearch
            loading={entityLoading}
            placeholder="请选择公司主体"
            style={{ width: 180 }}
            filterOption={(input, option) =>
              String(option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={entityList.map((entity: Api.Entity.Entity) => ({
              label: entity.name,
              value: entity.id
            }))}
          />
        </AForm.Item>

        <AForm.Item
          label="渠道ID"
          name="app_chan_id"
        >
          <AInputNumber
            placeholder="渠道ID"
            style={{ width: 120 }}
          />
        </AForm.Item>

        <AForm.Item>
          <ASpace>
            <AButton
              htmlType="submit"
              loading={loading}
              type="primary"
            >
              搜索
            </AButton>
            <AButton onClick={onReset}>重置</AButton>
          </ASpace>
        </AForm.Item>
      </AForm>
    </ACard>
  );
};
