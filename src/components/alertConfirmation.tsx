import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertProps {
  open: boolean;
  title: string;
  description: string;
  children?: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isConfirmButtonDisabled?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  open,
  title,
  description,
  children,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  isConfirmButtonDisabled = false,
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-lg p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white mt-2">
            {description}
          </AlertDialogDescription>
          {children && <>{children}</>}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel
            onClick={onCancel}
            className="flex-1 py-2 text-center rounded "
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isConfirmButtonDisabled}
            onClick={onConfirm}
            className="flex-1 py-2 text-center rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
