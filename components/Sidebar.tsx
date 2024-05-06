import React, { useEffect, useState } from "react";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SettingsModal from "./SettingsModal";
import {
    ArrowLeftOnRectangleIcon,
    ChatBubbleLeftIcon,
    LinkIcon,
    MoonIcon,
    TrashIcon,
    UserIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import SessionManager from "../services/SessionManager";
import { ChatSession } from "../services/StorageStrategy";
import ChatSessionItem from "./ChatSessionItem";

const Sidebar = () => {
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [sessionManager, setSessionManager] = useState(null);
    const [isStorageReady, setIsStorageReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const initSessionManager = async () => {
            if (typeof window !== "undefined") {
                try {
                    const sessionManager = new SessionManager();
                    setSessionManager(sessionManager);
                    await sessionManager.waitForStorageReady();
                    setIsStorageReady(true);
                } catch (error) {
                    console.error("Error initializing SessionManager:", error);
                    // Handle the error appropriately
                }
            }
        };

        initSessionManager();
    }, []);

    useEffect(() => {
        const fetchSessions = async () => {
            if (sessionManager && isStorageReady) {
                const fetchedSessions = await sessionManager.getAllSessions();
                setSessions(fetchedSessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
            }
        };

        fetchSessions();
    }, [sessionManager, isStorageReady]);

    const toggleSettingsModal = () => {
        setShowSettingsModal(!showSettingsModal);
    };

    // Create function to handle new chat button which simply change the route to "/"
    const handleNewChat = () => {
        // Handle new chat logic here
        // route to "/"
        router.push("/");
    };

    const handleRenameSession = (sessionId, newCaption) => {
        setSessions((prevSessions) =>
            prevSessions.map((session) =>
                session._id === sessionId ? { ...session, caption: newCaption } : session
            )
        );
    };

    return (
        <div className="w-64 flex flex-col">
            <div className="relative flex flex-col flex-grow overflow-y-auto bg-zinc-900 pt-5">
                <button
                    onClick={handleNewChat}
                    className="flex items-center justify-between p-2  hover:bg-zinc-800 mx-2 rounded text-zinc-300 relative transition-all"
                >
                    <div className="flex items-center">
                        <img src="/groq.svg" alt="GroqChat" className="h-6 w-6 mr-2" />
                        <span>GroqChat</span>
                    </div>
                    <div className="flex space-x-1  p-1">
                        <PlusIcon className="h-4 w-4 text-zinc-400" />
                    </div>
                </button>
                <div className="mt-5 flex flex-col text-zinc-300">
                    {sessions.length > 0 &&
                        sessions.map((session) => (
                            <ChatSessionItem
                                key={session._id} // Add a unique key prop
                                session={session}
                                sessionManager={sessionManager}
                                onRenameSession={handleRenameSession}
                            />
                        ))}
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
