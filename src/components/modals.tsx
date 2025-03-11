import { useEffect, useRef } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  position?: { top: number; left: number };
  customPosition?: { top: number; left: number };
}> = ({
  isOpen,
  onClose,
  children,
  className,
  style,
  position,
  customPosition,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleDocumentClick);
    } else {
      document.removeEventListener("mousedown", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bg-transparent ${className ?? ""}`}
      style={{
        ...style,
        top: customPosition
          ? `${customPosition.top}px`
          : position?.top ?? "50%",
        left: customPosition
          ? `${customPosition.left}px`
          : position?.left ?? "50%",
        transform: customPosition ? "none" : "translate(-50%, -50%)",
      }}
      onClick={
        handleClickOutside as unknown as React.MouseEventHandler<HTMLDivElement>
      }
    >
      <div
        ref={modalRef}
        className="relative rounded-lg border border-gray-700 bg-gray-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute right-2 top-2 text-white" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

export const ChatOptionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
  position?: { top: number; left: number };
}> = ({ isOpen, onClose, onRename, onDelete, position }) => (
  <Modal isOpen={isOpen} onClose={onClose} customPosition={position}>
    <div className="flex flex-col space-y-4">
      <button
        className="flex items-center space-x-2 p-2 hover:bg-gray-700"
        onClick={onRename}
      >
        <PencilIcon className="h-5 w-5 text-white" />
        <span className="text-white">Rename</span>
      </button>
      <button
        className="flex items-center space-x-2 p-2 text-red-600 hover:bg-gray-700"
        onClick={onDelete}
      >
        <TrashIcon className="h-5 w-5" />
        <span>Delete</span>
      </button>
    </div>
  </Modal>
);
