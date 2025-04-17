
import React from 'react';
import { Menu, Phone, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <Home className="w-5 h-5 text-app-blue mr-2" />
        <span className="font-medium text-gray-800">小区：深圳万科城</span>
        <Button variant="link" className="text-app-blue ml-1 p-0 h-auto">切换</Button>
      </div>
      <Button variant="ghost" className="text-app-orange p-0 h-auto flex items-center hover:bg-transparent">
        <Phone className="w-4 h-4 mr-1" />
        <span>呼叫记录</span>
      </Button>
    </header>
  );
};

export default Header;
