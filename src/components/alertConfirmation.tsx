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
  /** Whether the alert dialog is open */
  open: boolean;
  /** Title of the alert dialog */
  title: string;
  /** Description text of the alert dialog */
  description: string;
  /** Function to call when the primary action is clicked */
  onConfirm: () => void;
  /** Function to call when cancel is clicked */
  onCancel?: () => void;
  /** Label for the primary action button */
  confirmText?: string;
  /** Label for the cancel button */
  cancelText?: string;
}

/**
 * Reusable alert dialog component
 */
const Alert: React.FC<AlertProps> = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Continue",
  cancelText = "Cancel",
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
