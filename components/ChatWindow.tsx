// groqchat/components/ChatWindow.tsx
import React, { useState } from "react";
import GroqService from "../services/GroqService";
import StorageService from "../services/StorageService";
import MessageBox from "../components/MessageBox";
import InputForm from "../components/InputForm";

interface ChatWindowProps {
    setHasAnswered: (hasAnswered: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ setHasAnswered }) => {
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
    const [userInput, setUserInput] = useState("");

    const handleUserInput = async (e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e) {
            e.preventDefault();
        }

        setHasAnswered(true);

        if (userInput.trim()) {
            const model = StorageService.getModel() || "llama3-8b-8192";
            const systemPrompt = StorageService.getSystemPrompt() || "";
            const groqService = new GroqService();

            const newMessages = [...messages, { role: "user", content: userInput }];
            setMessages(newMessages);
            setUserInput("");

            const assistantResponse = await groqService.getChatCompletion(model, systemPrompt, newMessages);
            setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: assistantResponse }]);
        }
    };

    return (
        <div className="flex flex-col text-zinc-300 h-screen">
            <MessageBox messages={messages} setHasAnswered={setHasAnswered} />
            <InputForm userInput={userInput} setUserInput={setUserInput} handleUserInput={handleUserInput} />
        </div>
    );
};

export default ChatWindow;