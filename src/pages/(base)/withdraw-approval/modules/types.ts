export interface WithdrawalSearchParams {
  app_chan_id?: number;
  app_id?: number;
  approver_name?: string;
  entity_id?: number;
  keyword?: string;
  page?: number;
  page_size?: number;
  platform?: string;
  status?: string;
}

export interface WithdrawalListState {
  data: Api.Withdraw.Info[];
  loading: boolean;
  searchParams: WithdrawalSearchParams;
  total: number;
}

export interface ApprovalOperation {
  action: 'approve' | 'reject';
  record: Api.Withdraw.Info;
  remarks?: string;
}
