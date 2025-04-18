
/**
 * API服务接口
 */

// 模拟数据
import buildings from './mock/buildings.js';
import tenants from './mock/tenants.js';
import callRecords from './mock/callRecords.js';
import callDetails from './mock/callDetails.js';

// 模拟延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  // 获取楼栋列表
  async getBuildings() {
    await delay();
    return {
      code: 0,
      msg: '获取成功',
      data: buildings
    };
  },
  
  // 获取楼栋内的住户
  async getTenants(params) {
    await delay();
    const buildingId = params.building_id;
    const filteredTenants = tenants.filter(tenant => tenant.building_id === buildingId);
    
    return {
      code: 0,
      msg: '获取成功',
      data: filteredTenants
    };
  },
  
  // 创建呼叫记录
  async createCallRecord(params) {
    await delay(500);
    const { task_id, creator, total_calls, selected_tenants } = params;
    
    // 在实际应用中，这里应该是一个实际的API请求
    const newRecord = {
      id: Math.random().toString(36).substring(2, 10),
      task_id,
      creator,
      total_calls,
      connected_calls: 0,
      rejected_calls: 0,
      busy_calls: 0,
      no_answer_calls: total_calls,
      intercept_count: 0,
      empty_count: 0,
      debt_count: 0,
      hangup_count: 0,
      mute_count: 0,
      status: 'in_progress',
      created_at: new Date().toISOString()
    };
    
    // 添加到呼叫记录列表（仅用于模拟）
    callRecords.unshift(newRecord);
    
    // 创建对应的呼叫详情
    const selectedTenantData = tenants.filter(tenant => 
      selected_tenants.includes(tenant.id)
    );
    
    selectedTenantData.forEach(tenant => {
      const building = buildings.find(b => b.id === tenant.building_id);
      const buildingName = building ? building.name : "";
      
      callDetails.push({
        id: Math.random().toString(36).substring(2, 15),
        record_id: newRecord.id,
        tenant_name: tenant.name,
        unit_info: `${buildingName}${tenant.unit_number}`,
        debt_amount: tenant.debt_amount,
        debt_period: tenant.debt_period,
        call_status: 'no_answer',
        has_recording: false,
        created_at: new Date().toISOString()
      });
    });
    
    return {
      code: 0,
      msg: '创建成功',
      data: newRecord
    };
  },
  
  // 获取呼叫记录列表
  async getCallRecords() {
    await delay();
    return {
      code: 0,
      msg: '获取成功',
      data: callRecords
    };
  },
  
  // 获取呼叫详情
  async getCallDetails(params) {
    await delay();
    const recordId = params.record_id;
    const filteredDetails = callDetails.filter(detail => detail.record_id === recordId);
    
    return {
      code: 0,
      msg: '获取成功',
      data: filteredDetails
    };
  }
};
