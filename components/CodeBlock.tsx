import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface CodeBlockProps {
    className?: string;
    children: React.ReactNode;
}

const renderToString = (children: React.ReactNode): string => {
    if (typeof children === "string") {
        return children;
    }
    if (children == null) {
        return "";
    }
    const childrenArray = React.Children.toArray(children);
    return childrenArray.map((child) => {
        if (typeof child === "string") {
            return child;
        } else if (React.isValidElement(child)) {
            return renderToString(child.props.children);
        }
        return "";
    }).join("");
};

const CodeBlock: React.FC<CodeBlockProps> = ({ className, children }) => {
    const [copied, setCopied] = useState(false);
    let language = className ? className.replace("language-", "") : "plaintext";
    language = language.replace("code-highlight", "")
    // If language is empty, default to plaintext
    language = language || "plaintext";

    // 
    const codeContent = renderToString(children); // Ensure you handle children as React nodes properly

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative bg-zinc-900 rounded-md my-4">
            <div className="flex justify-between items-center px-4 py-2 bg-zinc-900 rounded-t-md">
                <span className="text-xs font-medium text-zinc-300">{language}</span>
                <CopyToClipboard text={codeContent} onCopy={handleCopy}>
                    <button className="flex text-xs text-zinc-400 hover:text-zinc-300 transition-colors">
                        {copied ? "Copied!" : "Copy Code"}
                    </button>
                </CopyToClipboard>
            </div>
            <div className="p-4 text-sm leading-relaxed border-t border-zinc-800 overflow-auto">{children}</div>

        </div>
    );
};

export default CodeBlock;
