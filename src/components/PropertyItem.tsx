
import React from 'react';
import { ChevronDown, ChevronRight, Home, Building2, Network, User } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface Building {
  id: string;
  name: string;
  units: string;
  network: string;
  manager: string;
  tenants: any[];
}

interface PropertyItemProps {
  building: Building;
  isExpanded: boolean;
  onToggle: () => void;
}

const PropertyItem: React.FC<PropertyItemProps> = ({ building, isExpanded, onToggle }) => {
  return (
    <div 
      className="p-4 bg-white flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors rounded-t-lg shadow-sm"
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        <Checkbox id={`checkbox-${building.id}`} onClick={(e) => e.stopPropagation()} />
        <div>
          <div className="flex items-center">
            <Building2 className="w-5 h-5 text-app-blue mr-2" />
            <h3 className="font-bold text-lg text-gray-800">{building.name}</h3>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="filter-badge bg-blue-50 text-blue-700 border border-blue-100 flex items-center">
              <Home className="w-3 h-3 mr-1 text-blue-500" />
              {building.units}
            </span>
            <span className="filter-badge bg-green-50 text-green-700 border border-green-100 flex items-center">
              <Network className="w-3 h-3 mr-1 text-green-500" />
              {building.network}
            </span>
            <span className="filter-badge bg-purple-50 text-purple-700 border border-purple-100 flex items-center">
              <User className="w-3 h-3 mr-1 text-purple-500" />
              {building.manager}
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-gray-500">
        {isExpanded ? 
          <ChevronDown className="h-5 w-5 text-app-blue transition-transform duration-200" /> : 
          <ChevronRight className="h-5 w-5 text-app-blue transition-transform duration-200" />
        }
      </div>
    </div>
  );
};

export default PropertyItem;
