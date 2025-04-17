
import React, { useState, useEffect } from 'react';
import { Search, Phone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import FilterDropdown from '@/components/FilterDropdown';
import PropertyItem from '@/components/PropertyItem';
import TenantItem from '@/components/TenantItem';
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
  const { toast } = useToast();

  // Fetch buildings from Supabase
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
          // Automatically expand the first building if any exist
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

  // Fetch tenants for expanded building
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
            // Ensure the tenantsData conforms to the Tenant type
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

      // Only fetch if we don't already have the data
      if (!tenants[expandedBuilding]) {
        fetchTenants();
      }
    }
  }, [expandedBuilding, toast, tenants]);

  const handleExpand = (buildingId: string) => {
    if (expandedBuilding === buildingId) {
      setExpandedBuilding(null);
    } else {
      setExpandedBuilding(buildingId);
    }
  };

  // Function to filter tenants based on search query
  const filterTenants = (buildingTenants: Tenant[], searchLower: string): Tenant[] => {
    if (!searchLower) return buildingTenants;
    
    return buildingTenants.filter(tenant => 
      tenant.name.toLowerCase().includes(searchLower) ||
      tenant.unit_number.toLowerCase().includes(searchLower) ||
      tenant.debt_amount.toString().includes(searchLower)
    );
  };

  // Filter buildings based on search query
  const filteredBuildings = buildings.filter(building => {
    const searchLower = searchQuery.toLowerCase();
    
    // If there's no search, show all buildings
    if (!searchLower) return true;
    
    // Check if building properties match search
    const buildingMatches = 
      building.name.toLowerCase().includes(searchLower) ||
      building.network.toLowerCase().includes(searchLower) ||
      building.manager.toLowerCase().includes(searchLower);
    
    // If building directly matches, show it
    if (buildingMatches) return true;
    
    // Otherwise, check if any tenant in the building matches
    return tenants[building.id] && tenants[building.id].some(tenant => 
      tenant.name.toLowerCase().includes(searchLower) ||
      tenant.unit_number.toLowerCase().includes(searchLower) ||
      tenant.debt_amount.toString().includes(searchLower)
    );
  });

  // Handle search button click
  const handleSearch = () => {
    // This will trigger the useEffect to re-filter buildings
    // The filtering is already happening reactively based on searchQuery state
    toast({
      title: "搜索完成",
      description: `找到 ${filteredBuildings.length} 个匹配结果`,
    });
  };
  
  // Handle building selection (select/deselect all tenants in the building)
  const handleBuildingSelection = (buildingId: string, checked: boolean) => {
    // Update building selection state
    setSelectedBuildings(prev => ({
      ...prev,
      [buildingId]: checked
    }));
    
    // If we have tenants for this building, select/deselect all of them
    if (tenants[buildingId]) {
      const updatedTenants = { ...selectedTenants };
      
      tenants[buildingId].forEach(tenant => {
        updatedTenants[tenant.id] = checked;
      });
      
      setSelectedTenants(updatedTenants);
    }
    
    // If not already fetched, fetch tenants for this building and select them
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
            // Ensure the tenantsData conforms to the Tenant type
            const typedTenantsData: Tenant[] = tenantsData.map(tenant => ({
              ...tenant,
              action_type: tenant.action_type as 'call' | 'work' | 'bill' | 'suggestion'
            }));
            
            // Update tenants state
            setTenants(prev => ({
              ...prev,
              [buildingId]: typedTenantsData
            }));
            
            // Select all tenants
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
  
  // Handle individual tenant selection
  const handleTenantSelection = (tenantId: string, checked: boolean) => {
    setSelectedTenants(prev => ({
      ...prev,
      [tenantId]: checked
    }));
    
    // Check if all tenants in a building are selected, if so, select the building too
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
  
  // Get count of selected tenants
  const getSelectedTenantsCount = () => {
    return Object.values(selectedTenants).filter(Boolean).length;
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
          <Button 
            className="bg-app-blue hover:bg-app-blue/90 text-white shadow-sm rounded-lg"
            onClick={handleSearch}
          >
            搜索
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <FilterDropdown label="客户标签" />
          <FilterDropdown label="催缴次数" />
          <FilterDropdown label="进度标签" />
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue"></div>
          </div>
        )}
        
        {/* No Results */}
        {!loading && filteredBuildings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            没有找到匹配的结果
          </div>
        )}
        
        {/* Building List */}
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
                      // When searching, only show matching tenants
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
                      // When not searching, show all tenants
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
      
      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-lg">
        <Button 
          className="w-full bg-app-orange hover:bg-app-orange/90 text-white font-medium rounded-lg py-5"
          disabled={getSelectedTenantsCount() === 0}
        >
          一键AI呼叫 {getSelectedTenantsCount() > 0 ? `(${getSelectedTenantsCount()})` : ''}
        </Button>
      </div>
    </div>
  );
};

export default Index;
