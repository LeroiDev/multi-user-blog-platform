import { Fragment } from "react";
import {
  Dialog,
  Description,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Button } from "./CustomButton";

interface ConfirmationDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={onCancel}
      >
        {/* SIMPLE BACKDROP */}
        {open && <div onClick={onCancel} />}

        {/* DIALOG PANEL */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95 translate-y-4"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-4"
        >
          <div className="relative z-10 bg-white rounded-lg p-6 shadow-lg w-full max-w-sm mx-4">
            <DialogTitle className="text-lg font-semibold text-neutral-900">
              {title}
            </DialogTitle>
            <Description className="mt-2 text-sm text-neutral-600">
              {description}
            </Description>

            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="secondary" onClick={onCancel}>
                {cancelText}
              </Button>
              <Button variant="error" onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
