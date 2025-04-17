
import React from 'react';
import { Menu, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center text-md">
        <span className="font-medium">小区：深圳万科城</span>
        <Button variant="link" className="text-black ml-2 p-0 h-auto">切换</Button>
      </div>
      <Button variant="link" className="text-app-orange p-0 h-auto flex items-center">
        <Phone className="w-4 h-4 mr-1" />
        <span>呼叫记录</span>
      </Button>
    </header>
  );
};

export default Header;
