// @ts-nocheck
// components/MessageBox.tsx
import React, { useRef, useEffect } from "react";
import Message from "./Message";
import Image from "next/image";
import CrawlingStatus from "./CrawlingStatus";

interface MessageBoxProps {
    messages: { role: "user" | "assistant"; content: string }[];
    setHasAnswered: (hasAnswered: boolean) => void;
    handleEditMessage: (messageIndex: number, editedContent: string) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ messages, setHasAnswered, handleEditMessage }) => {
    const userMessageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lastUserMessageIndex = messages.findLastIndex((message) => message.role === "user");
        const lastUserMessageRef = userMessageRefs.current[lastUserMessageIndex];

        if (lastUserMessageRef && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = lastUserMessageRef.offsetTop;
        }
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 w-full" ref={messagesContainerRef}>
            <div className="flex flex-col max-w-3xl mx-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className="flex max-w-full break-word"
                        ref={(el) => (userMessageRefs.current[index] = el)}
                    >
                        {message.role == "status" ? (
                            <CrawlingStatus urls={message.urls || []} />
                        ) : (
                            <>
                                <div className="h-8 w-8 bg-orange-600 rounded-full p-3 mr-2 flex items-center justify-center">
                                    {message.role === "user" ? (
                                        "B"
                                    ) : (
                                        <Image
                                            src="/groq.svg"
                                            className="max-w-none"
                                            alt="Open AI logo"
                                            width={18}
                                            height={18}
                                            unoptimized
                                        />
                                    )}
                                </div>
                                <Message message={message} index={index} handleEditMessage={handleEditMessage} />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageBox;
