
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Calendar, Clock, Tag, AlertCircle } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  building: string;
  debtAmount: string;
  debtPeriod: string;
  callCount: string;
  displayType: string;
  status: string;
  actionType: 'call' | 'work' | 'bill' | 'suggestion';
  actionText?: string;
}

interface TenantItemProps {
  tenant: Tenant;
}

const TenantItem: React.FC<TenantItemProps> = ({ tenant }) => {
  const getActionButton = () => {
    switch (tenant.actionType) {
      case 'bill':
        return (
          <Button className="action-badge action-badge-blue">
            {tenant.actionText || '发送账单'}
          </Button>
        );
      case 'suggestion':
        return (
          <Button className="action-badge action-badge-orange">
            {tenant.actionText || '拜访建议'}
          </Button>
        );
      case 'call':
        return (
          <Button className="action-badge action-badge-blue">
            AI呼叫
          </Button>
        );
      case 'work':
        return (
          <Button className="action-badge action-badge-gray">
            关闭工单
          </Button>
        );
      default:
        return null;
    }
  };

  // Function to extract the call count number from the string
  const getCallCount = () => {
    const match = tenant.callCount.match(/\d+/);
    return match ? match[0] : '1';
  };

  return (
    <div className="p-3 border-b border-gray-100 bg-white hover:bg-gray-50">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <Checkbox id={`tenant-${tenant.id}`} />
          <h3 className="font-bold">{tenant.name}</h3>
        </div>
        {getActionButton()}
      </div>
      
      <div className="ml-6 text-sm text-gray-600">
        <p>{tenant.building}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-red-500 font-medium">{tenant.debtAmount}</span>
          <span>{tenant.debtPeriod}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="tag-badge bg-blue-50 border-blue-200">
            <Phone className="h-3 w-3 mr-1 text-blue-500" />
            <span>{getCallCount()}</span>
          </span>
          <span className="tag-badge bg-amber-50 border-amber-200">
            <Tag className="h-3 w-3 mr-1 text-amber-500" />
            <span>{tenant.displayType}</span>
          </span>
          <span className="tag-badge bg-gray-100 border-gray-300">
            <AlertCircle className="h-3 w-3 mr-1 text-gray-500" />
            <span>{tenant.status}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TenantItem;
