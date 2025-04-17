
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
      default:
        return null;
    }
  };

  return (
    <div className="p-3 border-b border-gray-100 bg-white">
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
          <span>{tenant.debtAmount}</span>
          <span>{tenant.debtPeriod}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="tag-badge">{tenant.callCount}</span>
          <span className="tag-badge">{tenant.displayType}</span>
          <span className="tag-badge bg-app-gray">{tenant.status}</span>
        </div>
      </div>
    </div>
  );
};

export default TenantItem;
