// groqchat/components/Sidebar.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeftOnRectangleIcon,
    ChatBubbleLeftIcon,
    LinkIcon,
    MoonIcon,
    PlusIcon,
    TrashIcon,
    UserIcon,
} from "@heroicons/react/24/outline";

interface ChatWindowProps {
    hasAnswered: boolean;
}

const IdeasPanel: React.FC<ChatWindowProps> = ({ hasAnswered }) => {
    if (hasAnswered) {
        return null;
    }

    return (
        <div className="flex flex-col space-y-4 justify-center items-center flex-1 inset-x-0 top-0 bottom-0">
            <div className="flex items-center space-x-2">
                <Image src="/groq.svg" alt="Groq Logo" width={32} height={32} />
                <h1 className="text-3xl font-bold text-zinc-400">GroqChat</h1>
            </div>
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-center">
                    {[1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-sm shadow-sm w-60"
                        >
                            <div className="text-left p-1">
                                <div className="font-bold text-zinc-400">Give me ideas</div>
                                <p>for what to do on a rainy day</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IdeasPanel;
