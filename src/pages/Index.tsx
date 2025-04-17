import React, { useState, useEffect } from 'react';
import { Search, Phone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import FilterDropdown from '@/components/FilterDropdown';
import PropertyItem from '@/components/PropertyItem';
import TenantItem from '@/components/TenantItem';
import CallDialog from '@/components/CallDialog';
import { supabase } from "@/integrations/supabase/client";
import { Building, Tenant } from '@/types/buildings';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [tenants, setTenants] = useState<{[key: string]: Tenant[]}>({}); 
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTenants, setSelectedTenants] = useState<{[key: string]: boolean}>({});
  const [selectedBuildings, setSelectedBuildings] = useState<{[key: string]: boolean}>({});
  const [callFilterDialogOpen, setCallFilterDialogOpen] = useState(false);
  const [timeRestrictDialogOpen, setTimeRestrictDialogOpen] = useState(false);
  const [isCallTimeAllowed, setIsCallTimeAllowed] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        const { data: buildingsData, error: buildingsError } = await supabase
          .from('buildings')
          .select('*')
          .order('name');
          
        if (buildingsError) {
          console.error("Error fetching buildings:", buildingsError);
          toast({
            title: "数据加载失败",
            description: "无法加载建筑物数据",
            variant: "destructive",
          });
          return;
        }

        if (buildingsData) {
          setBuildings(buildingsData);
          if (buildingsData.length > 0) {
            setExpandedBuilding(buildingsData[0].id);
          }
        }
      } catch (error) {
        console.error("Error in fetchBuildings:", error);
        toast({
          title: "数据加载失败",
          description: "无法加载建筑物数据",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [toast]);

  useEffect(() => {
    if (expandedBuilding) {
      const fetchTenants = async () => {
        try {
          const { data: tenantsData, error: tenantsError } = await supabase
            .from('tenants')
            .select('*')
            .eq('building_id', expandedBuilding)
            .order('name');
            
          if (tenantsError) {
            console.error("Error fetching tenants:", tenantsError);
            toast({
              title: "数据加载失败",
              description: "无法加载住户数据",
              variant: "destructive",
            });
            return;
          }

          if (tenantsData) {
            const typedTenantsData: Tenant[] = tenantsData.map(tenant => ({
              ...tenant,
              action_type: tenant.action_type as 'call' | 'work' | 'bill' | 'suggestion'
            }));
            
            setTenants(prev => ({
              ...prev,
              [expandedBuilding]: typedTenantsData
            }));
          }
        } catch (error) {
          console.error("Error in fetchTenants:", error);
          toast({
            title: "数据加载失败",
            description: "无法加载住户数据",
            variant: "destructive",
          });
        }
      };

      if (!tenants[expandedBuilding]) {
        fetchTenants();
      }
    }
  }, [expandedBuilding, toast, tenants]);

  useEffect(() => {
    const checkCallTime = () => {
      const now = new Date();
      const hours = now.getHours();
      
      setIsCallTimeAllowed(
        (hours >= 9 && hours < 12) || 
        (hours >= 14 && hours < 20)
      );
    };
    
    checkCallTime();
    const interval = setInterval(checkCallTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleExpand = (buildingId: string) => {
    if (expandedBuilding === buildingId) {
      setExpandedBuilding(null);
    } else {
      setExpandedBuilding(buildingId);
    }
  };

  const filterTenants = (buildingTenants: Tenant[], searchLower: string): Tenant[] => {
    if (!searchLower) return buildingTenants;
    
    return buildingTenants.filter(tenant => 
      tenant.name.toLowerCase().includes(searchLower) ||
      tenant.unit_number.toLowerCase().includes(searchLower) ||
      tenant.debt_amount.toString().includes(searchLower)
    );
  };

  const filteredBuildings = buildings.filter(building => {
    const searchLower = searchQuery.toLowerCase();
    
    if (!searchLower) return true;
    
    const buildingMatches = 
      building.name.toLowerCase().includes(searchLower) ||
      building.network.toLowerCase().includes(searchLower) ||
      building.manager.toLowerCase().includes(searchLower);
    
    if (buildingMatches) return true;
    
    return tenants[building.id] && tenants[building.id].some(tenant => 
      tenant.name.toLowerCase().includes(searchLower) ||
      tenant.unit_number.toLowerCase().includes(searchLower) ||
      tenant.debt_amount.toString().includes(searchLower)
    );
  });

  const handleSearch = () => {
    toast({
      title: "搜索完成",
      description: `找到 ${filteredBuildings.length} 个匹配结果`,
    });
  };

  const handleBuildingSelection = (buildingId: string, checked: boolean) => {
    setSelectedBuildings(prev => ({
      ...prev,
      [buildingId]: checked
    }));
    
    if (tenants[buildingId]) {
      const updatedTenants = { ...selectedTenants };
      
      tenants[buildingId].forEach(tenant => {
        updatedTenants[tenant.id] = checked;
      });
      
      setSelectedTenants(updatedTenants);
    }
    
    if (!tenants[buildingId] && checked) {
      const fetchTenants = async () => {
        try {
          const { data: tenantsData, error: tenantsError } = await supabase
            .from('tenants')
            .select('*')
            .eq('building_id', buildingId)
            .order('name');
            
          if (tenantsError) {
            console.error("Error fetching tenants:", tenantsError);
            toast({
              title: "数据加载失败",
              description: "无法加载住户数据",
              variant: "destructive",
            });
            return;
          }

          if (tenantsData) {
            const typedTenantsData: Tenant[] = tenantsData.map(tenant => ({
              ...tenant,
              action_type: tenant.action_type as 'call' | 'work' | 'bill' | 'suggestion'
            }));
            
            setTenants(prev => ({
              ...prev,
              [buildingId]: typedTenantsData
            }));
            
            const updatedTenants = { ...selectedTenants };
            typedTenantsData.forEach(tenant => {
              updatedTenants[tenant.id] = checked;
            });
            setSelectedTenants(updatedTenants);
          }
        } catch (error) {
          console.error("Error in fetchTenants:", error);
          toast({
            title: "数据加载失败",
            description: "无法加载住户数据",
            variant: "destructive",
          });
        }
      };
      
      fetchTenants();
    }
    
    toast({
      title: checked ? "已选择整栋楼" : "已取消选择",
      description: checked ? "已选择此楼所有住户" : "已取消选择此楼所有住户",
    });
  };

  const handleTenantSelection = (tenantId: string, checked: boolean) => {
    setSelectedTenants(prev => ({
      ...prev,
      [tenantId]: checked
    }));
    
    for (const buildingId in tenants) {
      const buildingTenants = tenants[buildingId];
      const allSelected = buildingTenants.every(tenant => 
        tenant.id === tenantId ? checked : selectedTenants[tenant.id]
      );
      
      if (allSelected !== selectedBuildings[buildingId]) {
        setSelectedBuildings(prev => ({
          ...prev,
          [buildingId]: allSelected
        }));
      }
    }
  };

  const getSelectedTenantsCount = () => {
    return Object.values(selectedTenants).filter(Boolean).length;
  };

  const handleCallButtonClick = () => {
    if (!isCallTimeAllowed) {
      setTimeRestrictDialogOpen(true);
      return;
    }
    
    setCallFilterDialogOpen(true);
  };

  const handleStartCalls = () => {
    const selectedCount = getSelectedTenantsCount();
    
    toast({
      title: "AI呼叫已开始",
      description: `已开始对 ${selectedCount} 位客户的AI自动呼叫`,
    });
    
    setSelectedTenants({});
    setSelectedBuildings({});
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 relative bg-gray-50">
      <Header />
      
      <main className="flex-1 px-4 pb-4">
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
          <Button 
            className="bg-app-blue hover:bg-app-blue/90 text-white shadow-sm rounded-lg"
            onClick={handleSearch}
          >
            搜索
          </Button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <FilterDropdown label="客户标签" />
          <FilterDropdown label="催缴次数" />
          <FilterDropdown label="进度标签" />
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue"></div>
          </div>
        )}
        
        {!loading && filteredBuildings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            没有找到匹配的结果
          </div>
        )}
        
        <div className="space-y-3">
          {filteredBuildings.map(building => (
            <div key={building.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
              <PropertyItem 
                building={{
                  id: building.id,
                  name: building.name,
                  units: `${building.units}户`,
                  network: building.network,
                  manager: `管家:${building.manager}`,
                  tenants: tenants[building.id] || [],
                  selected: selectedBuildings[building.id]
                }}
                isExpanded={expandedBuilding === building.id}
                onToggle={() => handleExpand(building.id)}
                onSelect={handleBuildingSelection}
              />
              
              {expandedBuilding === building.id && tenants[building.id] && (
                <div className="border-t border-gray-200">
                  {tenants[building.id].length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      该建筑物下暂无住户
                    </div>
                  ) : (
                    searchQuery ? 
                      filterTenants(tenants[building.id], searchQuery.toLowerCase()).map(tenant => (
                        <TenantItem 
                          key={tenant.id} 
                          tenant={{
                            id: tenant.id,
                            name: tenant.name,
                            building: `${building.name}${tenant.unit_number}`,
                            debtAmount: `欠:${tenant.debt_amount}元`,
                            debtPeriod: `欠费时长:${tenant.debt_period}月`,
                            callCount: `本月已叫${tenant.call_count}次`,
                            displayType: tenant.display_type,
                            status: tenant.status,
                            actionType: tenant.action_type,
                            actionText: tenant.action_text || undefined,
                            selected: selectedTenants[tenant.id]
                          }}
                          onSelect={handleTenantSelection}
                        />
                      ))
                    : 
                      tenants[building.id].map(tenant => (
                        <TenantItem 
                          key={tenant.id} 
                          tenant={{
                            id: tenant.id,
                            name: tenant.name,
                            building: `${building.name}${tenant.unit_number}`,
                            debtAmount: `欠:${tenant.debt_amount}元`,
                            debtPeriod: `欠费时长:${tenant.debt_period}月`,
                            callCount: `本月已叫${tenant.call_count}次`,
                            displayType: tenant.display_type,
                            status: tenant.status,
                            actionType: tenant.action_type,
                            actionText: tenant.action_text || undefined,
                            selected: selectedTenants[tenant.id]
                          }}
                          onSelect={handleTenantSelection}
                        />
                      ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-lg">
        <Button 
          className="w-full bg-app-orange hover:bg-app-orange/90 text-white font-medium rounded-lg py-5"
          disabled={getSelectedTenantsCount() === 0}
          onClick={handleCallButtonClick}
        >
          一键AI呼叫 {getSelectedTenantsCount() > 0 ? `(${getSelectedTenantsCount()})` : ''}
        </Button>
      </div>
      
      <CallDialog
        open={callFilterDialogOpen}
        onOpenChange={setCallFilterDialogOpen}
        title="提示"
        content={
          <div className="space-y-2">
            <p>以下情形系统呼叫时将自动过滤(不呼叫)</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>同一天内只允许呼叫一次，今日已呼叫的客户将自动过滤</li>
              <li>有明确欠费原因且工单待关闭的。</li>
              <li>客户已明确愿意缴费的。</li>
            </ol>
          </div>
        }
        cancelText="取消"
        confirmText="确认开始"
        onCancel={() => setCallFilterDialogOpen(false)}
        onConfirm={handleStartCalls}
      />
      
      <CallDialog
        open={timeRestrictDialogOpen}
        onOpenChange={setTimeRestrictDialogOpen}
        title="提示"
        content={
          <p>当前时段不可呼叫客户！可呼叫时段为上午9:00至12点，下午14:00至20:00</p>
        }
        confirmText="我知道了"
        singleButton={true}
        onConfirm={() => setTimeRestrictDialogOpen(false)}
      />
    </div>
  );
};

export default Index;
