
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronDown } from "lucide-react";
import Header from '@/components/Header';
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
        <div className="flex mb-6 gap-2">
          <Input 
            className="flex-1" 
            placeholder="输入客户名或房号称搜索" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}>搜索</Button>
        </div>
        
        <div className="space-y-4">
          {/* Call Records */}
          {mockCallRecords.map(record => (
            <div key={record.id} className="border rounded-lg bg-white overflow-hidden">
              {/* Record Header */}
              <div 
                className="p-4 cursor-pointer" 
                onClick={() => toggleExpand(record.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-xl font-bold">呼叫任务:{record.task_id}</h2>
                    <span className="text-sm text-gray-500">创建人: {record.creator}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(record.status)}`}>
                      {getStatusText(record.status)}
                    </span>
                    {expandedRecordId === record.id ? 
                      <ChevronDown className="h-5 w-5" /> : 
                      <ChevronRight className="h-5 w-5" />
                    }
                  </div>
                </div>
                
                {/* Statistics */}
                <div className="grid grid-cols-5 gap-2 mt-4 text-sm">
                  <div>总数:{record.total_calls}</div>
                  <div>接通:{record.connected_calls}</div>
                  <div>拒接:{record.rejected_calls}</div>
                  <div>占线:{record.busy_calls}</div>
                  <div>无应答:{record.no_answer_calls}</div>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-2 text-sm">
                  <div>拦截:{record.intercept_count}</div>
                  <div>空号:{record.empty_count}</div>
                  <div>欠费:{record.debt_count}</div>
                  <div>关机:{record.hangup_count}</div>
                  <div>屏蔽:{record.mute_count}</div>
                </div>
              </div>
              
              {/* Expanded Details */}
              {expandedRecordId === record.id && (
                <div className="border-t p-4 bg-gray-50 space-y-4">
                  {mockCallDetails.filter(detail => detail.record_id === record.id).map(detail => (
                    <Card key={detail.id} className="p-0 overflow-hidden">
                      <div className="grid grid-cols-2 p-3">
                        <div>
                          <div className="font-medium">{detail.tenant_name}</div>
                          <div className="text-sm text-gray-600">{detail.unit_info}</div>
                          <div className="text-sm text-red-600">
                            欠:{detail.debt_amount}元 欠费时长:{detail.debt_period}月
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" className="ml-auto">
                            听录音
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 border-t">
                        <div className={`p-3 text-center ${getCallStatusClass(detail.call_status)}`}>
                          {getCallStatusText(detail.call_status)}
                        </div>
                        {detail.call_duration && (
                          <div className="p-3 text-center bg-gray-100">
                            {detail.call_duration}秒
                          </div>
                        )}
                        {!detail.call_duration && (
                          <div className="p-3 text-center bg-gray-100">
                            对话文本
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
