// components/ChatSessionItem.tsx
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import SessionManager from "../services/SessionManager";
import { useRouter } from "next/navigation";
import { ChatSession } from "../services/StorageStrategy";

interface ChatSessionItemProps {
    session: ChatSession;
    sessionManager: SessionManager;
    onRenameSession: (sessionId: string, newCaption: string) => void;
}

const ChatSessionItem: React.FC<ChatSessionItemProps> = ({ session, sessionManager, onRenameSession }) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const router = useRouter();
    const contextMenuRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = () => {
        console.log("handleContextMenu");
        setShowContextMenu(!showContextMenu);
    };

    const handleRename = async () => {
        setShowContextMenu(false);
        let new_caption = prompt("Enter new caption", session.caption);
        if (!new_caption) {
            return;
        }
        await sessionManager.renameSession(session._id, new_caption);
        onRenameSession(session._id, new_caption);
    };

    const handleDelete = async () => {
        await sessionManager.deleteSession(session._id);
        router.push("/");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setShowContextMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex  items-center justify-between p-2 px-3 hover:bg-zinc-800 mx-2 rounded text-zinc-400 relative transition-all">
            <Link
                key={session._id}
                href={`/c/${session._id}`}
                className="flex truncate flex-1 w-full items-center"
            >
                <div className="flex-grow truncate">{session.caption}</div>
            </Link>
            <div className="ml-2">
                <button onClick={handleContextMenu}>
                    <EllipsisHorizontalIcon className="h-5 w-5 text-zinc-500" />
                </button>
                {showContextMenu && (
                    <div
                        ref={contextMenuRef}
                        className="absolute right-0 mt-2 p-2 bg-zinc-900 text-zinc-400 rounded shadow-md px-1 z-10 border border-zinc-700  transition-all"
                    >
                        <button
                            onClick={handleRename}
                            className="block px-4 py-2 hover:bg-zinc-800 w-full text-left rounded-md transition-all"
                        >
                            <PencilIcon className="h-4 w-4 inline-block mr-3" />
                            Rename
                        </button>
                        <button
                            onClick={handleDelete}
                            className="block px-4 py-2 hover:bg-zinc-800 w-full  text-left rounded-md  transition-all"
                        >
                            <TrashIcon className="h-4 w-4 inline-block mr-3" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSessionItem;
