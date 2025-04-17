
import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  singleButton?: boolean;
}

const CallDialog: React.FC<CallDialogProps> = ({
  open,
  onOpenChange,
  title,
  content,
  cancelText = "取消",
  confirmText = "确认开始",
  onCancel,
  onConfirm,
  singleButton = false,
}) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0 space-y-4">
          <div className="text-gray-700">{content}</div>
        </div>
        <div className="flex border-t border-gray-200">
          {!singleButton && (
            <Button 
              variant="ghost" 
              className="flex-1 rounded-none border-r border-gray-200 py-5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:ring-0 focus:ring-offset-0"
              onClick={handleCancel}
            >
              <X className="mr-2 h-4 w-4" />
              {cancelText}
            </Button>
          )}
          <Button 
            variant="ghost" 
            className={`flex-1 rounded-none py-5 text-app-orange hover:text-app-orange hover:bg-gray-50 focus:ring-0 focus:ring-offset-0 ${singleButton ? 'font-medium' : ''}`}
            onClick={handleConfirm}
          >
            <Check className="mr-2 h-4 w-4" />
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
