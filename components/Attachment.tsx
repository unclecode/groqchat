// components/Attachment.tsx
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";

interface AttachmentProps {
    attachment: any;
    onToggleActive: (attachmentIndex: number) => void;
    onDelete: (attachmentIndex: number) => void;
}

// const Attachment: React.FC<AttachmentProps> = ({ attachment, onToggleActive, onDelete }) => {
//     return (
//         <div className="attachment-item flex items-center justify-between space-x-2 text-sm pb-2">
//             <div className="flex items-center space-x-2">
//                 <label className="flex items-center">
//                     <input
//                         type="checkbox"
//                         className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
//                         checked={attachment.active}
//                         onChange={() => onToggleActive(attachment.index)}
//                     />
//                     <span className="ml-2">{attachment.source}</span>
//                 </label>
//             </div>
//             <button
//                 className="text-gray-400 hover:text-red-500 focus:outline-none"
//                 onClick={() => onDelete(attachment.index)}
//             >
//                 <TrashIcon className="h-4 w-4" />
//             </button>
//         </div>
//     );
// };

const Attachment: React.FC<AttachmentProps> = ({ attachment, onToggleActive, onDelete }) => {
    return (
        <div className="attachment-item flex items-center justify-between space-x-2 text-sm pb-3">
            <div className="flex items-center space-x-2 w-full">
                <label className="flex items-center flex-1">
                    <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                        checked={attachment.active}
                        onChange={() => onToggleActive(attachment.index)}
                    />
                    <span
                        className="ml-2 truncate" // Add truncate class to truncate the text
                        style={{
                            maxWidth: "150px", // Set a max width to truncate the text
                        }}
                    >
                        {attachment.source}
                    </span>
                </label>
                <button
                    className="text-gray-400 hover:text-red-500 focus:outline-none"
                    onClick={() => onDelete(attachment.index)}
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default Attachment;
