// groqchat/components/Sidebar.tsx
import React from "react";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Link from "next/link";
import SettingsModal from "./SettingsModal";
import {
    ArrowLeftOnRectangleIcon,
    ChatBubbleLeftIcon,
    LinkIcon,
    MoonIcon,
    PlusIcon,
    TrashIcon,
    UserIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const toggleSettingsModal = () => {
        setShowSettingsModal(!showSettingsModal);
    };
    return (
        <div className="w-64 flex flex-col">
            <div className="relative flex flex-col flex-grow overflow-y-auto bg-zinc-900 pt-5">
                <button className="flex space-x-1 p-2 hover:bg-zinc-700 mx-2 border border-zinc-700 rounded text-zinc-300">
                    <PlusIcon className="h-6 w-6 text-zinc-400" />
                    New Chat
                </button>
                <div className="mt-5 flex flex-col text-zinc-300">
                    <Link
                        href="/home"
                        className="flex space-x-2 p-2 hover:bg-zinc-700 mx-2 bg-zinc-700 rounded text-zinc-300 items-center"
                    >
                        <ChatBubbleLeftIcon className="h-6 w-6 text-zinc-500" />
                        <p>Translation Request</p>
                    </Link>
                </div>
                <div className="absolute bottom-0 inset-x-0 border-t border-zinc-700 mx-2 py-6 px-2">
                    {/* Sidebar links */}
                    <Link
                        href="#"
                        onClick={toggleSettingsModal}
                        className="flex space-x-2 p-2 hover:bg-zinc-700 mx-2 rounded text-zinc-300 text-sm items-center"
                    >
                        <Cog8ToothIcon className="h-5 w-5 text-zinc-500" />
                        <p>Settings</p>
                    </Link>
                    <Link
                        href="/home"
                        className="flex space-x-2 p-2 hover:bg-zinc-700 mx-2 rounded text-zinc-300 text-sm items-center"
                    >
                        <TrashIcon className="h-5 w-5 text-zinc-500" />
                        <p>Clear conversations</p>
                    </Link>
                    <Link
                        href="/home"
                        className="flex space-x-2 p-2 hover:bg-zinc-700 mx-2 rounded text-zinc-300 text-sm items-center"
                    >
                        <MoonIcon className="h-5 w-5 text-zinc-500" />
                        <p>Dark Mode</p>
                    </Link>
                    <Link
                        href="/home"
                        className="flex space-x-2 p-2 hover:bg-zinc-700 mx-2 rounded text-zinc-300 text-sm items-center"
                    >
                        <LinkIcon className="h-5 w-5 text-zinc-500" />
                        <p>Updates</p>
                    </Link>
                    <Link
                        href="/home"
                        className="flex space-x-2 p-2 hover:bg-zinc-700 mx-2 rounded text-zinc-300 text-sm items-center"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5 text-zinc-500" />
                        <p>Logout</p>
                    </Link>
                </div>
            </div>
            {showSettingsModal && <SettingsModal onClose={toggleSettingsModal} />}
        </div>
    );
};

export default Sidebar;
