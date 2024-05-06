// components/ChatWindow.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import GroqService from "../services/GroqService";
import StorageService from "../services/StorageService";
import MessageBox from "../components/MessageBox";
import InputForm from "../components/InputForm";
import { SessionManager } from "../services/SessionManager";

interface ChatWindowProps {
    sessionId?: string;
    setHasAnswered: (hasAnswered: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ sessionId, setHasAnswered }) => {
    const router = useRouter();
    const [messages, setMessages] = useState<
        { role: "user" | "assistant"; content: string; createdAt: Date; liked?: boolean }[]
    >([]);
    const [userInput, setUserInput] = useState("");
    const [sessionManager, setSessionManager] = useState<SessionManager | null>(null);
    const [isStorageReady, setIsStorageReady] = useState(false);

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
        const initSession = async () => {
            if (sessionManager && isStorageReady) {
                if (sessionId) {
                    const session = await sessionManager.getSession(sessionId);
                    if (session) {
                        setMessages(session.messages);
                    }
                } else {
                    const model =
                        StorageService.getCurrentSessionModel() || StorageService.getDefaultModel() || "llama3-8b-8192";
                    const newSessionId = await sessionManager.createSession(model);
                    setMessages([]);
                    router.push(`/c/${newSessionId}`);
                }
            }
        };

        initSession();
    }, [sessionManager, isStorageReady, sessionId]);

    const handleUserInput = (e) => {
        e?.preventDefault(); // Prevent form submit if called from form event
        setHasAnswered(true);

        if (userInput.trim() && sessionManager && sessionId && isStorageReady) {
            sessionManager
                .updateSession(sessionId, { role: "user", content: userInput })
                .then(() => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { role: "user", content: userInput, createdAt: new Date() },
                    ]);
                    setUserInput("");

                    console.log(messages);
                })
                .catch((error) => {
                    console.error("Error updating session:", error);
                    // Handle the error appropriately
                });
        }
    };

    // Effect to call GroqService whenever messages change
    useEffect(() => {
        const handleAssistantResponse = async () => {
            if (messages.length > 0 && messages[messages.length - 1].role === "user") {
                const model = StorageService.getCurrentSessionModel() || "llama3-8b-8192";
                const systemPrompt = StorageService.getSystemPrompt() || "";
                const groqService = new GroqService();
                // From all messages keep role, and content
                let cleanMessages = messages.map(({ role, content }) => ({ role, content }));
                const assistantResponse = await groqService.getChatCompletion(model, systemPrompt, cleanMessages);
                sessionManager
                    .updateSession(sessionId, { role: "assistant", content: assistantResponse })
                    .then(() => {
                        console.log("Session updated successfully");
                    })
                    .catch((error) => {
                        console.error("Error updating session:", error);
                        // Handle the error appropriately
                    });

                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: "assistant", content: assistantResponse, createdAt: new Date() },
                ]);
            }
        };

        handleAssistantResponse();
    }, [messages]); // Dependency array includes messages

    return (
        <div className="flex flex-col text-zinc-300 h-screen">
            <MessageBox messages={messages} setHasAnswered={setHasAnswered} />
            <InputForm userInput={userInput} setUserInput={setUserInput} handleUserInput={handleUserInput} />
        </div>
    );
};

export default ChatWindow;
