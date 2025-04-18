
<template>
  <view class="container">
    <!-- 标题 -->
    <view class="header">
      <text class="title">呼叫记录</text>
    </view>
    
    <!-- 搜索栏 -->
    <view class="search-area">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input 
          type="text" 
          placeholder="输入客户名或房号称搜索" 
          v-model="searchTerm"
          @confirm="handleSearch"
        />
      </view>
      <button class="search-btn" @tap="handleSearch">搜索</button>
    </view>
    
    <!-- 加载中 -->
    <view class="loading" v-if="loading">
      <view class="loading-spinner"></view>
    </view>
    
    <!-- 无数据提示 -->
    <view class="no-data" v-if="!loading && filteredRecords.length === 0">
      没有找到匹配的呼叫记录
    </view>
    
    <!-- 记录列表 -->
    <view class="records-list">
      <view 
        class="record-item" 
        v-for="record in filteredRecords" 
        :key="record.id"
      >
        <!-- 记录头部 -->
        <view class="record-header" @tap="toggleExpand(record.id)">
          <view class="record-info">
            <view class="record-icon">
              <text class="iconfont icon-phone"></text>
            </view>
            <view class="record-basic">
              <view class="record-title">呼叫任务:{{ record.task_id }}</view>
              <view class="record-meta">创建人: {{ record.creator }} · {{ record.created_at }}</view>
            </view>
          </view>
          <view class="record-status">
            <view class="status-badge" :class="getStatusClass(record.status)">
              {{ getStatusText(record.status) }}
            </view>
            <view class="expand-icon">
              <text class="iconfont" :class="expandedRecordId === record.id ? 'icon-up' : 'icon-right'"></text>
            </view>
          </view>
        </view>
        
        <!-- 统计数据 -->
        <view class="record-stats">
          <view class="stat-item stat-total">
            <view class="stat-label">总数</view>
            <view class="stat-value">{{ record.total_calls }}</view>
          </view>
          <view class="stat-item stat-connected">
            <view class="stat-label">接通</view>
            <view class="stat-value">{{ record.connected_calls }}</view>
          </view>
          <view class="stat-item stat-rejected">
            <view class="stat-label">拒接</view>
            <view class="stat-value">{{ record.rejected_calls }}</view>
          </view>
          <view class="stat-item stat-busy">
            <view class="stat-label">占线</view>
            <view class="stat-value">{{ record.busy_calls }}</view>
          </view>
          <view class="stat-item stat-no-answer">
            <view class="stat-label">无应答</view>
            <view class="stat-value">{{ record.no_answer_calls }}</view>
          </view>
        </view>
        
        <view class="record-tags">
          <text class="tag">拦截: {{ record.intercept_count }}</text>
          <text class="tag">空号: {{ record.empty_count }}</text>
          <text class="tag">欠费: {{ record.debt_count }}</text>
          <text class="tag">关机: {{ record.hangup_count }}</text>
          <text class="tag">屏蔽: {{ record.mute_count }}</text>
        </view>
        
        <!-- 详细内容 -->
        <view class="record-details" v-if="expandedRecordId === record.id">
          <view v-if="callDetails[record.id] && callDetails[record.id].length > 0">
            <view 
              class="detail-item" 
              v-for="detail in callDetails[record.id]" 
              :key="detail.id"
            >
              <view class="detail-header">
                <view class="detail-person">
                  <view class="detail-name">{{ detail.tenant_name }}</view>
                  <view class="detail-address">{{ detail.unit_info }}</view>
                  <view class="detail-debt">
                    欠费金额: <text class="bold">{{ detail.debt_amount }}元</text> · 时长: {{ detail.debt_period }}月
                  </view>
                </view>
                <button 
                  class="recording-btn" 
                  v-if="detail.has_recording"
                  @tap="playRecording(detail.id)"
                >
                  <text class="iconfont icon-play"></text>
                  听录音
                </button>
              </view>
              <view class="detail-status">
                <view :class="['status-block', getCallStatusClass(detail.call_status)]">
                  {{ getCallStatusText(detail.call_status) }}
                </view>
                <view class="status-block duration" v-if="detail.call_duration">
                  通话时长: {{ detail.call_duration }}秒
                </view>
                <view class="status-block duration" v-else>
                  暂无对话文本
                </view>
              </view>
            </view>
          </view>
          <view v-else class="no-details">
            {{ callDetails[record.id] ? "暂无呼叫详情" : "加载呼叫详情中..." }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: '',
      expandedRecordId: null,
      callRecords: [],
      callDetails: {},
      loading: true
    }
  },
  computed: {
    filteredRecords() {
      if (!this.searchTerm) {
        return this.callRecords;
      }
      
      return this.callRecords.filter(record => 
        record.task_id.includes(this.searchTerm) || 
        record.creator.includes(this.searchTerm)
      );
    }
  },
  onLoad() {
    this.fetchCallRecords();
  },
  onPullDownRefresh() {
    this.fetchCallRecords().then(() => {
      uni.stopPullDownRefresh();
    });
  },
  methods: {
    async fetchCallRecords() {
      try {
        this.loading = true;
        
        // 这里应该替换为您的实际API调用
        const res = await this.$api.getCallRecords();
        
        if (res.code === 0 && res.data) {
          this.callRecords = res.data;
          if (this.callRecords.length > 0) {
            this.expandedRecordId = this.callRecords[0].id;
            await this.fetchCallDetails(this.callRecords[0].id);
          }
        } else {
          uni.showToast({
            title: '数据加载失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error("Error in fetchCallRecords:", error);
        uni.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCallDetails(recordId) {
      if (this.callDetails[recordId]) return; // Already fetched
      
      try {
        // 这里应该替换为您的实际API调用
        const res = await this.$api.getCallDetails({
          record_id: recordId
        });
        
        if (res.code === 0 && res.data) {
          this.$set(this.callDetails, recordId, res.data);
        } else {
          uni.showToast({
            title: '无法加载呼叫详情',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error("Error in fetchCallDetails:", error);
        uni.showToast({
          title: '无法加载呼叫详情',
          icon: 'none'
        });
      }
    },
    
    handleSearch() {
      console.log("Searching for:", this.searchTerm);
    },
    
    async toggleExpand(recordId) {
      if (this.expandedRecordId === recordId) {
        this.expandedRecordId = null;
      } else {
        this.expandedRecordId = recordId;
        await this.fetchCallDetails(recordId);
      }
    },
    
    getStatusText(status) {
      switch (status) {
        case 'in_progress': return '执行中';
        case 'stopped': return '终止执行';
        case 'completed': return '已完成';
        default: return '';
      }
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'in_progress': return 'status-in-progress';
        case 'stopped': return 'status-stopped';
        case 'completed': return 'status-completed';
        default: return '';
      }
    },
    
    getCallStatusClass(status) {
      switch (status) {
        case 'connected': return 'call-connected';
        case 'rejected': return 'call-rejected';
        case 'no_answer': return 'call-no-answer';
        default: return '';
      }
    },
    
    getCallStatusText(status) {
      switch (status) {
        case 'connected': return '接通';
        case 'rejected': return '拒接';
        case 'no_answer': return '无应答';
        default: return '';
      }
    },
    
    playRecording(detailId) {
      uni.showToast({
        title: '录音播放功能待实现',
        icon: 'none'
      });
    }
  }
}
</script>

<style>
.container {
  padding: 30rpx;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #3498db;
}

.search-area {
  display: flex;
  margin-bottom: 30rpx;
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

.records-list {
  margin-bottom: 30rpx;
}

.record-item {
  margin-bottom: 30rpx;
  border-radius: 12rpx;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.record-header {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  background: linear-gradient(to right, #fff, #f9f9f9);
  border-bottom: 1px solid #f0f0f0;
}

.record-info {
  display: flex;
  align-items: center;
}

.record-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.record-icon .iconfont {
  color: #3498db;
  font-size: 40rpx;
}

.record-basic {
  display: flex;
  flex-direction: column;
}

.record-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.record-meta {
  font-size: 24rpx;
  color: #888;
  margin-top: 8rpx;
}

.record-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-right: 20rpx;
}

.status-in-progress {
  background-color: #e8f5e9;
  color: #4caf50;
}

.status-stopped {
  background-color: #fff3e0;
  color: #ff9800;
}

.status-completed {
  background-color: #f5f5f5;
  color: #616161;
}

.expand-icon {
  width: 60rpx;
  height: 60rpx;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-stats {
  display: flex;
  padding: 20rpx;
  flex-wrap: wrap;
}

.stat-item {
  flex: 1;
  min-width: 20%;
  padding: 16rpx;
  border-radius: 8rpx;
  margin: 10rpx;
  text-align: center;
}

.stat-label {
  font-size: 24rpx;
  color: #888;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 10rpx;
}

.stat-total {
  background-color: #e3f2fd;
}

.stat-total .stat-value {
  color: #2196f3;
}

.stat-connected {
  background-color: #e8f5e9;
}

.stat-connected .stat-value {
  color: #4caf50;
}

.stat-rejected {
  background-color: #ffebee;
}

.stat-rejected .stat-value {
  color: #f44336;
}

.stat-busy {
  background-color: #fff3e0;
}

.stat-busy .stat-value {
  color: #ff9800;
}

.stat-no-answer {
  background-color: #f3e5f5;
}

.stat-no-answer .stat-value {
  color: #9c27b0;
}

.record-tags {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20rpx 20rpx;
}

.tag {
  background-color: #f5f5f5;
  color: #666;
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 30rpx;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
}

.record-details {
  padding: 20rpx;
  background-color: #f9f9f9;
}

.detail-item {
  background-color: #fff;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.detail-person {
  display: flex;
  flex-direction: column;
}

.detail-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.detail-address {
  font-size: 24rpx;
  color: #888;
  margin-top: 6rpx;
}

.detail-debt {
  font-size: 24rpx;
  color: #f44336;
  margin-top: 10rpx;
}

.bold {
  font-weight: bold;
}

.recording-btn {
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  height: 60rpx;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6rpx;
  color: #666;
  font-size: 24rpx;
}

.recording-btn .iconfont {
  margin-right: 10rpx;
}

.detail-status {
  display: flex;
}

.status-block {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
}

.call-connected {
  background-color: #e8f5e9;
}

.call-rejected {
  background-color: #f5f5f5;
}

.call-no-answer {
  background-color: #ffebee;
}

.duration {
  background-color: #f5f5f5;
}

.no-details {
  text-align: center;
  padding: 40rpx;
  color: #888;
  font-size: 28rpx;
}
</style>
