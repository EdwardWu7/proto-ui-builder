
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ChevronRight, ChevronDown, Phone, PhoneCall, PhoneOff, PhoneForwarded, BarChart4 } from "lucide-react";
import Header from '@/components/Header';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CallRecord, CallDetail } from '@/types/buildings';

const CallRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [callRecords, setCallRecords] = useState<CallRecord[]>([]);
  const [callDetails, setCallDetails] = useState<{[key: string]: CallDetail[]}>({}); 
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCallRecords();
  }, []);

  const fetchCallRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('call_records')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching call records:", error);
        toast({
          title: "数据加载失败",
          description: "无法加载呼叫记录",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setCallRecords(data);
        if (data.length > 0) {
          setExpandedRecordId(data[0].id);
          await fetchCallDetails(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error in fetchCallRecords:", error);
      toast({
        title: "数据加载失败",
        description: "无法加载呼叫记录",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCallDetails = async (recordId: string) => {
    try {
      if (callDetails[recordId]) return; // Already fetched
      
      const { data, error } = await supabase
        .from('call_details')
        .select('*')
        .eq('record_id', recordId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching call details:", error);
        toast({
          title: "数据加载失败",
          description: "无法加载呼叫详情",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setCallDetails(prev => ({
          ...prev,
          [recordId]: data
        }));
      }
    } catch (error) {
      console.error("Error in fetchCallDetails:", error);
      toast({
        title: "数据加载失败",
        description: "无法加载呼叫详情",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    // Filter records client-side for now
    // In a real app, this would likely be a server-side search
    console.log("Searching for:", searchTerm);
  };

  const toggleExpand = async (recordId: string) => {
    if (expandedRecordId === recordId) {
      setExpandedRecordId(null);
    } else {
      setExpandedRecordId(recordId);
      await fetchCallDetails(recordId);
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

  const filteredRecords = searchTerm
    ? callRecords.filter(record => 
        record.task_id.includes(searchTerm) || 
        record.creator.includes(searchTerm)
      )
    : callRecords;

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
          <Button onClick={handleSearch}>搜索</Button>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue"></div>
          </div>
        )}
        
        {!loading && filteredRecords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            没有找到匹配的呼叫记录
          </div>
        )}
        
        <div className="space-y-4">
          {filteredRecords.map(record => (
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
                  {callDetails[record.id] && callDetails[record.id].length > 0 ? (
                    callDetails[record.id].map(detail => (
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
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      {callDetails[record.id] ? "暂无呼叫详情" : "加载呼叫详情中..."}
                    </div>
                  )}
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
