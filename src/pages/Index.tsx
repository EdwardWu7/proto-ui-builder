
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Phone, Menu } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from '@/components/Header';
import FilterDropdown from '@/components/FilterDropdown';
import PropertyItem from '@/components/PropertyItem';
import TenantItem from '@/components/TenantItem';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>('building2');
  
  const buildings = [
    {
      id: 'building1',
      name: '青花苑13栋',
      units: '267户',
      network: '网格B',
      manager: '管家:半夏',
      tenants: []
    },
    {
      id: 'building2',
      name: '青花苑14栋',
      units: '467户',
      network: '网格B',
      manager: '管家:半夏',
      tenants: [
        {
          id: 'tenant1',
          name: '张三',
          building: '青花苑1栋2单元3001房',
          debtAmount: '欠:18892元',
          debtPeriod: '欠费时长:14月',
          callCount: '本月已叫1次',
          displayType: '友好提示型',
          status: '待首次AI呼叫',
          actionType: 'call' as const
        },
        {
          id: 'tenant2',
          name: '李四',
          building: '青花苑1栋2单元3002房',
          debtAmount: '欠:18892元',
          debtPeriod: '欠费时长:14月',
          callCount: '本月已叫1次',
          displayType: '友好提示型',
          status: '待关闭工单',
          actionType: 'work' as const
        },
        {
          id: 'tenant3',
          name: '王五',
          building: '青花苑1栋2单元3002房',
          debtAmount: '欠:18892元',
          debtPeriod: '欠费时长:14月',
          callCount: '本月已叫1次',
          displayType: '友好提示型',
          status: '有缴费意愿',
          actionType: 'bill' as const,
          actionText: '发送账单'
        },
        {
          id: 'tenant4',
          name: '李四',
          building: '青花苑1栋2单元3002房',
          debtAmount: '欠:18892元',
          debtPeriod: '欠费时长:14月',
          callCount: '本月已叫1次',
          displayType: '友好提示型',
          status: '待上门拜访',
          actionType: 'suggestion' as const,
          actionText: '拜访建议'
        },
        {
          id: 'tenant5',
          name: '李四',
          building: '青花苑1栋2单元3002房',
          debtAmount: '欠:18892元',
          debtPeriod: '欠费时长:14月',
          callCount: '本月已叫1次',
          displayType: '友好提示型',
          status: '待AI二次呼叫',
          actionType: 'call' as const
        }
      ]
    }
  ];

  const handleExpand = (buildingId: string) => {
    if (expandedBuilding === buildingId) {
      setExpandedBuilding(null);
    } else {
      setExpandedBuilding(buildingId);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen pb-16 relative bg-gray-50">
      <Header />
      
      <main className="flex-1 px-4 pb-4">
        {/* Search Bar */}
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              type="text" 
              placeholder="输入客户名或房号等搜索" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-app-blue shadow-sm rounded-lg"
            />
          </div>
          <Button className="bg-app-blue hover:bg-app-blue/90 text-white shadow-sm rounded-lg">
            搜索
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <FilterDropdown label="客户标签" />
          <FilterDropdown label="催缴次数" />
          <FilterDropdown label="进度标签" />
        </div>
        
        {/* Building List */}
        <div className="space-y-3">
          {buildings.map(building => (
            <div key={building.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
              <PropertyItem 
                building={building}
                isExpanded={expandedBuilding === building.id}
                onToggle={() => handleExpand(building.id)}
              />
              
              {expandedBuilding === building.id && building.tenants.length > 0 && (
                <div className="border-t border-gray-200">
                  {building.tenants.map(tenant => (
                    <TenantItem key={tenant.id} tenant={tenant} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      
      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-lg">
        <Button className="w-full bg-app-orange hover:bg-app-orange/90 text-white font-medium rounded-lg py-5">一键AI呼叫</Button>
      </div>
    </div>
  );
};

export default Index;
