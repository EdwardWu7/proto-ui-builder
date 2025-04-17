
import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface FilterDropdownProps {
  label: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white border border-gray-300 shadow-sm flex items-center gap-1 text-gray-700 hover:bg-gray-50 rounded-full px-4 transition-all">
          <Filter className="h-3 w-3 text-gray-500 mr-1" />
          {label}
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-md rounded-lg">
        <DropdownMenuItem className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">选项一</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">选项二</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">选项三</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
