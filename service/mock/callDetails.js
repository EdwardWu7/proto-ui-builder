
// 呼叫详情模拟数据
export default [
  // 第一批呼叫记录的详情
  {
    id: "cd001",
    record_id: "cr001",
    tenant_name: "张三",
    unit_info: "金茂大厦1栋301",
    debt_amount: 560,
    debt_period: 3,
    call_status: "connected",
    call_duration: 125,
    has_recording: true,
    created_at: "2023-09-15T09:35:00Z"
  },
  {
    id: "cd002",
    record_id: "cr001",
    tenant_name: "李四",
    unit_info: "金茂大厦1栋402",
    debt_amount: 850,
    debt_period: 5,
    call_status: "connected",
    call_duration: 93,
    has_recording: true,
    created_at: "2023-09-15T09:40:00Z"
  },
  {
    id: "cd003",
    record_id: "cr001",
    tenant_name: "王五",
    unit_info: "金茂大厦2栋103",
    debt_amount: 320,
    debt_period: 2,
    call_status: "no_answer",
    call_duration: null,
    has_recording: false,
    created_at: "2023-09-15T09:45:00Z"
  },
  
  // 第二批呼叫记录的详情
  {
    id: "cd004",
    record_id: "cr002",
    tenant_name: "赵六",
    unit_info: "环球中心A座501",
    debt_amount: 1200,
    debt_period: 6,
    call_status: "rejected",
    call_duration: null,
    has_recording: false,
    created_at: "2023-10-05T14:20:00Z"
  },
  {
    id: "cd005",
    record_id: "cr002",
    tenant_name: "孙七",
    unit_info: "环球中心B座302",
    debt_amount: 480,
    debt_period: 3,
    call_status: "connected",
    call_duration: 146,
    has_recording: true,
    created_at: "2023-10-05T14:25:00Z"
  },
  
  // 第三批呼叫记录的详情
  {
    id: "cd006",
    record_id: "cr003",
    tenant_name: "周八",
    unit_info: "星河湾3栋201",
    debt_amount: 750,
    debt_period: 4,
    call_status: "connected",
    call_duration: 112,
    has_recording: true,
    created_at: "2023-11-12T10:50:00Z"
  },
  {
    id: "cd007",
    record_id: "cr003",
    tenant_name: "吴九",
    unit_info: "星河湾3栋502",
    debt_amount: 1500,
    debt_period: 8,
    call_status: "no_answer",
    call_duration: null,
    has_recording: false,
    created_at: "2023-11-12T10:55:00Z"
  }
];
