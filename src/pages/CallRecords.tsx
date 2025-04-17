import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ChevronRight, ChevronDown, Phone, PhoneCall, PhoneOff, PhoneForwarded, BarChart4 } from "lucide-react";
import Header from '@/components/Header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CallRecord, CallDetail } from '@/types/buildings';

// Mock data for demonstration
const mockCallRecords: CallRecord[] = [
  {
    id: "1",
    task_id: "20250427",
    creator: "张三丰",
    status: "in_progress",
    created_at: "2025-04-27",
    total_calls: 1898,
    connected_calls: 1289,
    rejected_calls: 123,
    busy_calls: 12,
    no_answer_calls: 123,
    intercept_count: 45,
    empty_count: 12,
    debt_count: 12,
    hangup_count: 35,
    mute_count: 35
  },
  {
    id: "2",
    task_id: "20250427",
    creator: "张三丰",
    status: "completed",
    created_at: "2025-04-27",
    total_calls: 1898,
    connected_calls: 1289,
    rejected_calls: 123,
    busy_calls: 12,
    no_answer_calls: 123,
    intercept_count: 45,
    empty_count: 12,
    debt_count: 12,
    hangup_count: 35,
    mute_count: 35
  },
  {
    id: "3",
    task_id: "20250425",
    creator: "张三丰",
    status: "completed",
    created_at: "2025-04-25",
    total_calls: 1898,
    connected_calls: 1289,
    rejected_calls: 123,
    busy_calls: 12,
    no_answer_calls: 123,
    intercept_count: 45,
    empty_count: 12,
    debt_count: 12,
    hangup_count: 35,
    mute_count: 35
  }
];

const mockCallDetails: CallDetail[] = [
  {
    id: "1",
    record_id: "3",
    tenant_name: "张三",
    unit_info: "青花苑1栋2单元3001房",
    debt_amount: 18892,
    debt_period: 14,
    call_status: "connected",
    call_duration: 67,
    has_recording: true
  },
  {
    id: "2",
    record_id: "3",
    tenant_name: "张三",
    unit_info: "青花苑1栋2单元3001房",
    debt_amount: 18892,
    debt_period: 14,
    call_status: "rejected",
    has_recording: false
  }
];

const CallRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>("3");

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // Implement actual search logic here
  };

  const toggleExpand = (recordId: string) => {
    if (expandedRecordId === recordId) {
      setExpandedRecordId(null);
    } else {
      setExpandedRecordId(recordId);
    }
  };

  const getStatusText = (status: CallRecord['status']) => {
    switch (status) {
      case 'in_progress': return '执行中';
      case 'stopped': return '终止执行';
      case 'completed': return '已完成';
      default: return '';
    }
  };

  const getStatusClass = (status: CallRecord['status']) => {
    switch (status) {
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'stopped': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return '';
    }
  };

  const getCallStatusClass = (status: CallDetail['call_status']) => {
    switch (status) {
      case 'connected': return 'bg-green-200';
      case 'rejected': return 'bg-gray-200';
      case 'no_answer': return 'bg-red-200';
      default: return '';
    }
  };

  const getCallStatusText = (status: CallDetail['call_status']) => {
    switch (status) {
      case 'connected': return '接通';
      case 'rejected': return '拒接';
      case 'no_answer': return '无应答';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center text-app-blue mb-6">呼叫记录</h1>
        
        {/* Search Bar */}
        <div className="flex mb-6 gap-2 relative">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              className="pl-10" 
              placeholder="输入客户名或房号称搜索" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>搜索</Button>
        </div>
        
        <div className="space-y-4">
          {mockCallRecords.map(record => (
            <div key={record.id} className="border rounded-lg bg-white overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
              {/* Record Header */}
              <div 
                className="p-5 cursor-pointer bg-gradient-to-r from-white to-gray-50 border-b"
                onClick={() => toggleExpand(record.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-app-blue/10 p-2 rounded-full">
                      <PhoneCall className="h-5 w-5 text-app-blue" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">呼叫任务:{record.task_id}</h2>
                      <div className="text-sm text-gray-500 mt-1">创建人: {record.creator} · {record.created_at}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(record.status)}`}>
                      {getStatusText(record.status)}
                    </span>
                    <div className="bg-gray-100 rounded-full p-1">
                      {expandedRecordId === record.id ? 
                        <ChevronDown className="h-5 w-5 text-gray-600" /> : 
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      }
                    </div>
                  </div>
                </div>
                
                {/* Statistics */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">总数</div>
                    <div className="text-lg font-semibold text-app-blue">{record.total_calls}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">接通</div>
                    <div className="text-lg font-semibold text-green-600">{record.connected_calls}</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">拒接</div>
                    <div className="text-lg font-semibold text-red-500">{record.rejected_calls}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">占线</div>
                    <div className="text-lg font-semibold text-orange-500">{record.busy_calls}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">无应答</div>
                    <div className="text-lg font-semibold text-purple-600">{record.no_answer_calls}</div>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">拦截: {record.intercept_count}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">空号: {record.empty_count}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">欠费: {record.debt_count}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">关机: {record.hangup_count}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">屏蔽: {record.mute_count}</span>
                </div>
              </div>
              
              {/* Expanded Details */}
              {expandedRecordId === record.id && (
                <div className="p-4 bg-gray-50 space-y-4">
                  {mockCallDetails.filter(detail => detail.record_id === record.id).map(detail => (
                    <Card key={detail.id} className="p-0 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center p-4 border-b">
                        <div>
                          <div className="font-medium text-gray-800">{detail.tenant_name}</div>
                          <div className="text-sm text-gray-500">{detail.unit_info}</div>
                          <div className="text-sm text-red-600 mt-1 font-medium">
                            欠费金额: <span className="font-bold">{detail.debt_amount}元</span> · 时长: {detail.debt_period}月
                          </div>
                        </div>
                        {detail.has_recording && (
                          <Button variant="outline" size="sm">
                            <PhoneCall className="mr-2 h-4 w-4" />
                            听录音
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2">
                        <div className={`p-3 text-center ${getCallStatusClass(detail.call_status)}`}>
                          <div className="text-sm font-medium">
                            {getCallStatusText(detail.call_status)}
                          </div>
                        </div>
                        {detail.call_duration && (
                          <div className="p-3 text-center bg-gray-100">
                            <div className="text-sm font-medium">通话时长: {detail.call_duration}秒</div>
                          </div>
                        )}
                        {!detail.call_duration && (
                          <div className="p-3 text-center bg-gray-100">
                            <div className="text-sm font-medium">暂无对话文本</div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallRecords;
