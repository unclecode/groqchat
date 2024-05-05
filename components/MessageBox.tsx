// MessageBox.tsx
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism-plus";
import CodeBlock from "./CodeBlock";

const LatexRenderer = ({ value }) => {
    console.log(value);
    return <ReactMarkdown children={value} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} />;
};

interface MessageBoxProps {
    messages: { role: "user" | "assistant"; content: string }[];
    setHasAnswered: (hasAnswered: boolean) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ messages, setHasAnswered }) => {
    const userMessageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lastUserMessageIndex = messages.findLastIndex((message) => message.role === "user");
        const lastUserMessageRef = userMessageRefs.current[lastUserMessageIndex];

        if (lastUserMessageRef && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = lastUserMessageRef.offsetTop;
        }
    }, [messages]);

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
        <div className="flex-1 overflow-y-auto p-4 mx-auto max-w-3xl w-full" ref={messagesContainerRef}>
            <div className="flex flex-col">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className="flex items-start mb-0 w-full"
                        ref={(el) => (userMessageRefs.current[index] = el)}
                    >
                        <div className="h-8 w-8 bg-orange-600 rounded-full p-2 mr-2 flex items-center justify-center">
                            {message.role === "user" ? (
                                "B"
                            ) : (
                                <Image src="/groq.svg" className="max-w-none" alt="Open AI logo" width={18} height={18} unoptimized />
                            )}
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-4 pb-8 pt-0 w-full message-content">
                            <div className="font-semibold mb-1">{message.role === "user" ? "You" : "Assistant"}</div>
                            <div className="prose prose-zinc max-w-none leading-relaxed">
                                <ReactMarkdown
                                    children={message.content}
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypePrism, rehypeKatex]}
                                    components={{
                                        code: renderCode,
                                        math: ({ value }) => <LatexRenderer value={value} />,
                                        inlineMath: ({ value }) => <LatexRenderer value={value} />,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageBox;
