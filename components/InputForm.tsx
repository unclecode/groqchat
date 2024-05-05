// InputForm.tsx
import React, { useRef, useEffect, useState } from "react";
import { PaperClipIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

interface InputFormProps {
    userInput: string;
    setUserInput: (input: string) => void;
    handleUserInput: (e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const InputForm: React.FC<InputFormProps> = ({ userInput, setUserInput, handleUserInput }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleUserInput(e);
        }
    };

    useEffect(() => {
        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.style.height = "auto";
            textArea.style.height = `${textArea.scrollHeight}px`;
            textArea.style.maxHeight = "350px"; // Set the maximum height here
            textArea.style.overflowY = textArea.scrollHeight > 150 ? "scroll" : "hidden";
        }
    }, [userInput]);

    return (
        <div className="mx-auto max-w-3xl w-full p-4 pt-0 pb-8">
            <div className="flex space-x-2 w-full bg-zinc-800 rounded-xl p-2 border border-zinc-700 items-end">
                <button className="flex items-center space-x-2 pl-2 text-white mb-2">
                    {/* Attachment icon */}
                    <PaperClipIcon className="h-5 w-5" />
                </button>
                <textarea
                    ref={textAreaRef}
                    className="flex-1 p-2 bg-transparent focus:outline-none text-zinc-300 resize-none overflow-y-auto"
                    placeholder="Type your message..."
                    value={userInput}
                    onInput={(e) => setUserInput(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                />
                <button
                    type="button"
                    onClick={handleUserInput}
                    className={`py-2 px-2 mb-1 rounded-md flex items-center justify-center ${
                        userInput.trim() ? "bg-zinc-200 " : "bg-zinc-700"
                    }`}
                    
                >
                    {/* Up arrow icon */}
                    <ArrowUpIcon className="h-4 w-4 text-zinc-900 transform px-0" />
                </button>
            </div>
        </div>
    );
};

export default InputForm;