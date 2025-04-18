
// 住户模拟数据
export default [
  // 金茂大厦住户
  {
    id: "t001",
    building_id: "b001",
    name: "张三",
    unit_number: "1栋301",
    debt_amount: 560,
    debt_period: 3,
    call_count: 2,
    display_type: "normal",
    status: "active",
    action_type: "call",
    action_text: null,
    created_at: "2023-07-15T10:30:00Z"
  },
  {
    id: "t002",
    building_id: "b001",
    name: "李四",
    unit_number: "1栋402",
    debt_amount: 850,
    debt_period: 5,
    call_count: 3,
    display_type: "warning",
    status: "pending",
    action_type: "bill",
    action_text: "本月底前会缴费",
    created_at: "2023-06-20T09:15:00Z"
  },
  {
    id: "t003",
    building_id: "b001",
    name: "王五",
    unit_number: "2栋103",
    debt_amount: 320,
    debt_period: 2,
    call_count: 1,
    display_type: "normal",
    status: "active",
    action_type: "call",
    action_text: null,
    created_at: "2023-08-05T11:45:00Z"
  },
  // 环球中心住户
  {
    id: "t004",
    building_id: "b002",
    name: "赵六",
    unit_number: "A座501",
    debt_amount: 1200,
    debt_period: 6,
    call_count: 4,
    display_type: "danger",
    status: "inactive",
    action_type: "work",
    action_text: "不在家，出差中",
    created_at: "2023-05-10T14:20:00Z"
  },
  {
    id: "t005",
    building_id: "b002",
    name: "孙七",
    unit_number: "B座302",
    debt_amount: 480,
    debt_period: 3,
    call_count: 2,
    display_type: "normal",
    status: "active",
    action_type: "call",
    action_text: null,
    created_at: "2023-09-25T16:10:00Z"
  },
  // 星河湾住户
  {
    id: "t006",
    building_id: "b003",
    name: "周八",
    unit_number: "3栋201",
    debt_amount: 750,
    debt_period: 4,
    call_count: 3,
    display_type: "warning",
    status: "pending",
    action_type: "suggestion",
    action_text: "将于下周缴费",
    created_at: "2023-10-12T08:40:00Z"
  },
  {
    id: "t007",
    building_id: "b003",
    name: "吴九",
    unit_number: "3栋502",
    debt_amount: 1500,
    debt_period: 8,
    call_count: 5,
    display_type: "danger",
    status: "inactive",
    action_type: "work",
    action_text: "本月底前联系",
    created_at: "2023-06-18T13:25:00Z"
  },
  // 阳光小区住户
  {
    id: "t008",
    building_id: "b004",
    name: "郑十",
    unit_number: "2栋101",
    debt_amount: 350,
    debt_period: 2,
    call_count: 1,
    display_type: "normal",
    status: "active",
    action_type: "call",
    action_text: null,
    created_at: "2023-11-05T15:30:00Z"
  },
  // 翡翠城住户
  {
    id: "t009",
    building_id: "b005",
    name: "刘一",
    unit_number: "A栋601",
    debt_amount: 920,
    debt_period: 5,
    call_count: 3,
    display_type: "warning",
    status: "pending",
    action_type: "bill",
    action_text: "本周五缴费",
    created_at: "2023-08-28T10:15:00Z"
  },
  {
    id: "t010",
    building_id: "b005",
    name: "陈二",
    unit_number: "B栋302",
    debt_amount: 420,
    debt_period: 3,
    call_count: 2,
    display_type: "normal",
    status: "active",
    action_type: "call",
    action_text: null,
    created_at: "2023-10-15T11:40:00Z"
  }
];
