// components/Attachment.tsx
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";

interface AttachmentProps {
    attachment: any;
    onToggleActive: (attachmentIndex: number) => void;
    onDelete: (attachmentIndex: number) => void;
}

const Attachment: React.FC<AttachmentProps> = ({ attachment, onToggleActive, onDelete }) => {
    return (
        <div className="flex items-center justify-between space-x-2 text-sm">
            <div className="flex items-center space-x-2">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                        checked={attachment.active}
                        onChange={() => onToggleActive(attachment.index)}
                    />
                    <span className="ml-2">{attachment.source}</span>
                </label>
            </div>
            <button
                className="text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={() => onDelete(attachment.index)}
            >
                <TrashIcon className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Attachment;