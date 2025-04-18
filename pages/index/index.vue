
<template>
  <view class="container">
    <!-- 搜索区域 -->
    <view class="search-area">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input 
          type="text" 
          placeholder="输入客户名或房号等搜索" 
          v-model="searchQuery"
          @confirm="handleSearch"
        />
      </view>
      <button class="search-btn" @tap="handleSearch">搜索</button>
    </view>
    
    <!-- 筛选区域 -->
    <scroll-view scroll-x class="filter-area">
      <view class="filter-item" @tap="openFilterDropdown('clientTag')">
        <text>客户标签</text>
        <text class="iconfont icon-down"></text>
      </view>
      <view class="filter-item" @tap="openFilterDropdown('callCount')">
        <text>催缴次数</text>
        <text class="iconfont icon-down"></text>
      </view>
      <view class="filter-item" @tap="openFilterDropdown('progressTag')">
        <text>进度标签</text>
        <text class="iconfont icon-down"></text>
      </view>
    </scroll-view>
    
    <!-- 加载中 -->
    <view class="loading" v-if="loading">
      <view class="loading-spinner"></view>
    </view>
    
    <!-- 无数据提示 -->
    <view class="no-data" v-if="!loading && filteredBuildings.length === 0">
      没有找到匹配的结果
    </view>
    
    <!-- 楼栋列表 -->
    <view class="building-list">
      <view 
        class="building-item" 
        v-for="building in filteredBuildings" 
        :key="building.id"
      >
        <!-- 楼栋信息 -->
        <view class="building-header" @tap="handleExpand(building.id)">
          <view class="building-info">
            <view class="checkbox-container">
              <checkbox 
                :checked="selectedBuildings[building.id]" 
                @tap.stop="handleBuildingSelection(building.id, !selectedBuildings[building.id])"
              />
            </view>
            <view class="building-details">
              <view class="building-name">{{ building.name }}</view>
              <view class="building-units">{{ building.units }}户</view>
            </view>
          </view>
          <view class="building-action">
            <view class="building-network">{{ building.network }}</view>
            <view class="building-manager">管家:{{ building.manager }}</view>
            <text class="iconfont" :class="expandedBuilding === building.id ? 'icon-up' : 'icon-down'"></text>
          </view>
        </view>
        
        <!-- 住户列表 -->
        <view class="tenants-container" v-if="expandedBuilding === building.id && tenants[building.id]">
          <view v-if="tenants[building.id].length === 0" class="no-tenants">
            该建筑物下暂无住户
          </view>
          <view 
            v-else
            class="tenant-item" 
            v-for="tenant in getFilteredTenants(building.id)" 
            :key="tenant.id"
          >
            <view class="tenant-header">
              <view class="checkbox-container">
                <checkbox 
                  :checked="selectedTenants[tenant.id]" 
                  @tap="handleTenantSelection(tenant.id, !selectedTenants[tenant.id])"
                />
              </view>
              <view class="tenant-info">
                <view class="tenant-name">{{ tenant.name }}</view>
                <view class="tenant-address">{{ building.name }}{{ tenant.unit_number }}</view>
              </view>
            </view>
            <view class="tenant-details">
              <view class="tenant-debt">欠:{{ tenant.debt_amount }}元</view>
              <view class="tenant-period">欠费时长:{{ tenant.debt_period }}月</view>
              <view class="tenant-calls">本月已叫{{ tenant.call_count }}次</view>
            </view>
            <view class="tenant-status" :class="'status-' + tenant.status">
              {{ getTenantStatusText(tenant.status) }}
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="bottom-button">
      <button 
        class="call-button" 
        :disabled="getSelectedTenantsCount() === 0"
        @tap="handleCallButtonClick"
      >
        一键AI呼叫 {{ getSelectedTenantsCount() > 0 ? `(${getSelectedTenantsCount()})` : '' }}
      </button>
    </view>
    
    <!-- 提示对话框 -->
    <uni-popup ref="callFilterDialog" type="center">
      <view class="dialog-container">
        <view class="dialog-title">提示</view>
        <view class="dialog-content">
          <view>以下情形系统呼叫时将自动过滤(不呼叫)</view>
          <view class="list">
            <view class="list-item">1. 同一天内只允许呼叫一次，今日已呼叫的客户将自动过滤</view>
            <view class="list-item">2. 有明确欠费原因且工单待关闭的。</view>
            <view class="list-item">3. 客户已明确愿意缴费的。</view>
          </view>
        </view>
        <view class="dialog-actions">
          <button class="btn-cancel" @tap="closeCallFilterDialog">取消</button>
          <button class="btn-confirm" @tap="handleStartCalls">确认开始</button>
        </view>
      </view>
    </uni-popup>
    
    <uni-popup ref="timeRestrictDialog" type="center">
      <view class="dialog-container">
        <view class="dialog-title">提示</view>
        <view class="dialog-content">
          <view>当前时段不可呼叫客户！可呼叫时段为上午9:00至12点，下午14:00至20:00</view>
        </view>
        <view class="dialog-actions single-button">
          <button class="btn-confirm" @tap="closeTimeRestrictDialog">我知道了</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      expandedBuilding: null,
      buildings: [],
      tenants: {},
      loading: true,
      selectedTenants: {},
      selectedBuildings: {},
      isCallTimeAllowed: true
    }
  },
  computed: {
    filteredBuildings() {
      const searchLower = this.searchQuery.toLowerCase();
      
      if (!searchLower) return this.buildings;
      
      return this.buildings.filter(building => {
        const buildingMatches = 
          building.name.toLowerCase().includes(searchLower) ||
          building.network.toLowerCase().includes(searchLower) ||
          building.manager.toLowerCase().includes(searchLower);
        
        if (buildingMatches) return true;
        
        return this.tenants[building.id] && this.tenants[building.id].some(tenant => 
          tenant.name.toLowerCase().includes(searchLower) ||
          tenant.unit_number.toLowerCase().includes(searchLower) ||
          tenant.debt_amount.toString().includes(searchLower)
        );
      });
    }
  },
  onLoad() {
    this.fetchBuildings();
    this.checkCallTime();
    this.setupCallTimeChecker();
  },
  methods: {
    async fetchBuildings() {
      try {
        this.loading = true;
        
        // 这里应该替换为您的实际API调用
        // 示例使用uni.request，您需要替换为实际的接口URL
        const res = await this.$api.getBuildings();
        
        if (res.code === 0 && res.data) {
          this.buildings = res.data;
          if (this.buildings.length > 0) {
            this.expandedBuilding = this.buildings[0].id;
            this.fetchTenants(this.buildings[0].id);
          }
        } else {
          uni.showToast({
            title: '数据加载失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error("Error in fetchBuildings:", error);
        uni.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async fetchTenants(buildingId) {
      if (this.tenants[buildingId]) return;
      
      try {
        // 这里应该替换为您的实际API调用
        const res = await this.$api.getTenants({
          building_id: buildingId
        });
        
        if (res.code === 0 && res.data) {
          this.$set(this.tenants, buildingId, res.data);
        } else {
          uni.showToast({
            title: '无法加载住户数据',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error("Error in fetchTenants:", error);
        uni.showToast({
          title: '无法加载住户数据',
          icon: 'none'
        });
      }
    },
    
    checkCallTime() {
      const now = new Date();
      const hours = now.getHours();
      
      this.isCallTimeAllowed = 
        (hours >= 9 && hours < 12) || 
        (hours >= 14 && hours < 20);
    },
    
    setupCallTimeChecker() {
      setInterval(() => {
        this.checkCallTime();
      }, 60000);
    },
    
    handleExpand(buildingId) {
      if (this.expandedBuilding === buildingId) {
        this.expandedBuilding = null;
      } else {
        this.expandedBuilding = buildingId;
        this.fetchTenants(buildingId);
      }
    },
    
    getFilteredTenants(buildingId) {
      if (!this.tenants[buildingId]) return [];
      
      const searchLower = this.searchQuery.toLowerCase();
      if (!searchLower) return this.tenants[buildingId];
      
      return this.tenants[buildingId].filter(tenant => 
        tenant.name.toLowerCase().includes(searchLower) ||
        tenant.unit_number.toLowerCase().includes(searchLower) ||
        tenant.debt_amount.toString().includes(searchLower)
      );
    },
    
    handleSearch() {
      uni.showToast({
        title: `找到 ${this.filteredBuildings.length} 个匹配结果`,
        icon: 'none'
      });
    },
    
    handleBuildingSelection(buildingId, checked) {
      this.$set(this.selectedBuildings, buildingId, checked);
      
      if (this.tenants[buildingId]) {
        this.tenants[buildingId].forEach(tenant => {
          this.$set(this.selectedTenants, tenant.id, checked);
        });
      }
      
      if (!this.tenants[buildingId] && checked) {
        this.fetchTenants(buildingId).then(() => {
          if (this.tenants[buildingId]) {
            this.tenants[buildingId].forEach(tenant => {
              this.$set(this.selectedTenants, tenant.id, checked);
            });
          }
        });
      }
      
      uni.showToast({
        title: checked ? '已选择整栋楼' : '已取消选择',
        icon: 'none'
      });
    },
    
    handleTenantSelection(tenantId, checked) {
      this.$set(this.selectedTenants, tenantId, checked);
      
      for (const buildingId in this.tenants) {
        const buildingTenants = this.tenants[buildingId];
        const allSelected = buildingTenants.every(tenant => 
          tenant.id === tenantId ? checked : this.selectedTenants[tenant.id]
        );
        
        if (allSelected !== this.selectedBuildings[buildingId]) {
          this.$set(this.selectedBuildings, buildingId, allSelected);
        }
      }
    },
    
    getSelectedTenantsCount() {
      return Object.values(this.selectedTenants).filter(Boolean).length;
    },
    
    getTenantStatusText(status) {
      const statusMap = {
        active: '活跃',
        inactive: '不活跃',
        pending: '待处理'
      };
      return statusMap[status] || status;
    },
    
    handleCallButtonClick() {
      if (!this.isCallTimeAllowed) {
        this.$refs.timeRestrictDialog.open();
        return;
      }
      
      this.$refs.callFilterDialog.open();
    },
    
    closeCallFilterDialog() {
      this.$refs.callFilterDialog.close();
    },
    
    closeTimeRestrictDialog() {
      this.$refs.timeRestrictDialog.close();
    },
    
    async handleStartCalls() {
      const selectedCount = this.getSelectedTenantsCount();
      
      try {
        const taskId = new Date().toISOString().split('T')[0].replace(/-/g, '');
        
        // 这里是API调用
        const res = await this.$api.createCallRecord({
          task_id: taskId,
          creator: "张三丰",
          total_calls: selectedCount,
          selected_tenants: Object.entries(this.selectedTenants)
            .filter(([_, isSelected]) => isSelected)
            .map(([tenantId, _]) => tenantId)
        });
        
        if (res.code === 0) {
          uni.showToast({
            title: `已开始对 ${selectedCount} 位客户的AI自动呼叫`,
            icon: 'none'
          });
          
          this.selectedTenants = {};
          this.selectedBuildings = {};
          
          uni.switchTab({
            url: '/pages/callRecords/callRecords'
          });
        } else {
          throw new Error(res.msg || '创建呼叫记录失败');
        }
      } catch (error) {
        console.error("Error in handleStartCalls:", error);
        uni.showToast({
          title: error.message || '执行自动呼叫过程中出现错误',
          icon: 'none'
        });
      } finally {
        this.closeCallFilterDialog();
      }
    },
    
    openFilterDropdown(type) {
      uni.showToast({
        title: `筛选功能 ${type} 待实现`,
        icon: 'none'
      });
    }
  }
}
</script>

<style>
.container {
  padding-bottom: 100rpx;
}

.search-area {
  display: flex;
  padding: 20rpx;
  gap: 20rpx;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 0 20rpx;
  border: 1px solid #e0e0e0;
}

.search-box input {
  flex: 1;
  height: 80rpx;
  padding-left: 20rpx;
}

.search-btn {
  width: 160rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #3498db;
  color: #fff;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.filter-area {
  display: flex;
  white-space: nowrap;
  padding: 10rpx 20rpx 20rpx;
}

.filter-item {
  display: inline-flex;
  align-items: center;
  height: 60rpx;
  padding: 0 20rpx;
  background: #fff;
  margin-right: 20rpx;
  border-radius: 6rpx;
  font-size: 26rpx;
  color: #333;
  border: 1px solid #e0e0e0;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60rpx 0;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-data {
  text-align: center;
  padding: 60rpx 0;
  color: #888;
  font-size: 28rpx;
}

.building-list {
  padding: 0 20rpx;
}

.building-item {
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.building-header {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1px solid #f0f0f0;
}

.building-info {
  display: flex;
  align-items: center;
}

.checkbox-container {
  margin-right: 20rpx;
}

.building-details {
  display: flex;
  flex-direction: column;
}

.building-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.building-units {
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}

.building-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.building-network, .building-manager {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.tenants-container {
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.no-tenants {
  text-align: center;
  padding: 40rpx;
  color: #888;
  font-size: 28rpx;
}

.tenant-item {
  padding: 30rpx;
  border-bottom: 1px solid #f0f0f0;
}

.tenant-header {
  display: flex;
  align-items: center;
}

.tenant-info {
  display: flex;
  flex-direction: column;
}

.tenant-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.tenant-address {
  font-size: 24rpx;
  color: #666;
  margin-top: 6rpx;
}

.tenant-details {
  display: flex;
  margin-top: 20rpx;
  flex-wrap: wrap;
}

.tenant-debt, .tenant-period, .tenant-calls {
  font-size: 24rpx;
  color: #666;
  margin-right: 20rpx;
  margin-bottom: 10rpx;
}

.tenant-debt {
  color: #e74c3c;
}

.tenant-status {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-top: 16rpx;
}

.status-active {
  background-color: #e1f5fe;
  color: #039be5;
}

.status-inactive {
  background-color: #f5f5f5;
  color: #9e9e9e;
}

.status-pending {
  background-color: #fff8e1;
  color: #ffa000;
}

.bottom-button {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.call-button {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background-color: #f39c12;
  color: #fff;
  border-radius: 10rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.call-button[disabled] {
  background-color: #f8c471;
  opacity: 0.6;
}

.dialog-container {
  width: 600rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.dialog-title {
  font-size: 34rpx;
  font-weight: bold;
  padding: 30rpx;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-content {
  padding: 30rpx;
  font-size: 28rpx;
  color: #333;
}

.list {
  margin-top: 20rpx;
}

.list-item {
  margin-bottom: 16rpx;
  font-size: 26rpx;
  padding-left: 20rpx;
}

.dialog-actions {
  display: flex;
  border-top: 1px solid #f0f0f0;
}

.dialog-actions.single-button button {
  flex: 1;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  font-size: 30rpx;
}

.btn-cancel {
  color: #666;
  border-right: 1px solid #f0f0f0;
}

.btn-confirm {
  color: #3498db;
  font-weight: bold;
}
</style>
