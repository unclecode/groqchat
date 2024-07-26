// @ts-nocheck
// components/Message.tsx
import React, { useState } from "react";
import { PencilSquareIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypePrism from "rehype-prism-plus";
import rehypeKatex from "rehype-katex";
import CodeBlock from "./CodeBlock";

interface MessageProps {
    message: { role: "user" | "assistant"; content: string };
    index: number;
    handleEditMessage: (messageIndex: number, editedContent: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, index, handleEditMessage }) => {
    const [isHover, setIsHover] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        handleEditMessage(index, editedContent);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedContent(message.content);
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(message.content);
    };

    const renderCode = ({ node, inline, className, children }) => {
        if (node.children.length === 1 && node.children[0].type === "text") {
            return (
                <code
                    className={
                        className + "  font-medium px-2 py-1 rounded font-mono text-sm text-zinc-300 bg-zinc-700"
                    }
                >
                    `{children}`
                </code>
            );
        } else {
            return <CodeBlock className={className}>{children}</CodeBlock>;
        }
    };

    return (
        <div
            className="bg-zinc-800 rounded-lg px-4 py-0 pb-3 w-full message-content relative overflow-hidden"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div className="font-semibold mb-1">{message.role === "user" ? "You" : "Assistant"}</div>
            {isEditing ? (
                <div>
                    <textarea
                        className="w-full p-2 rounded border border-zinc-600 bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="mt-2">
                        <button
                            className="px-4 py-2 rounded bg-orange-500 text-white mr-2 transition duration-200 hover:bg-orange-600"
                            onClick={handleSaveClick}
                        >
                            Save & Submit
                        </button>
                        <button
                            className="px-4 py-2 rounded border border-zinc-600 bg-zinc-800 text-zinc-300 transition duration-200 hover:bg-zinc-700"
                            onClick={handleCancelClick}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="prose prose-zinc max-w-none leading-relaxed overflow-hidden">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypePrism, rehypeKatex]}
                        components={{
                            code: renderCode,
                            pre: ({ node, ...props }) => (
                                <pre style={{ overflowX: "auto", maxWidth: "95%" }} {...props} />
                            ),
                            p: ({ node, ...props }) => (
                                <p
                                    style={{
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                        wordWrap: "break-word",
                                        hyphens: "auto",
                                    }}
                                    {...props}
                                />
                            ),
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
            )}
            <div
                className={`transition-opacity duration-200 py-2 ${
                    isHover && !isEditing ? "opacity-100" : "opacity-0"
                }`}
            >
                {message.role === "user" ? (
                    <button
                        className="text-zinc-400 hover:text-zinc-200 transition duration-200"
                        onClick={handleEditClick}
                    >
                        <PencilSquareIcon className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        className="text-zinc-400 hover:text-zinc-200 transition duration-200"
                        onClick={handleCopyClick}
                    >
                        <ClipboardDocumentIcon className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Message;
