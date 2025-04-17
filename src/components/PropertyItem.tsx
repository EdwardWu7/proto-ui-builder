
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
      className="p-3 bg-white flex items-center justify-between hover:bg-gray-50 cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        <Checkbox id={`checkbox-${building.id}`} onClick={(e) => e.stopPropagation()} />
        <div>
          <h3 className="font-bold text-lg">{building.name}</h3>
          <div className="flex gap-2 mt-1">
            <span className="filter-badge">{building.units}</span>
            <span className="filter-badge">{building.network}</span>
            <span className="filter-badge">{building.manager}</span>
          </div>
        </div>
      </div>
      
      <div className="text-gray-500">
        {isExpanded ? <ChevronDown className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
      </div>
    </div>
  );
};

export default PropertyItem;
