// components/ChatWindow.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GroqService from "../services/GroqService";
import Crawl4AIService from "../services/Crawl4AIService";
import StorageService from "../services/StorageService";
import MessageBox from "../components/MessageBox";
import InputForm from "../components/InputForm";
import SessionManager from "../services/SessionManager";

const extractUrls = (text: string): string[] => {
    const urlRegex = /@(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
};

const removeUrls = (text: string): string => {
    const urlRegex = /@(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, "").trim();
};

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
                        setHasAnswered(true);
                    }
                } else {
                    setMessages([]);
                }
            }
        };

        initSession();
    }, [sessionManager, isStorageReady, sessionId]);

    const handleUserInput = async (e) => {
        e?.preventDefault();
        setHasAnswered(true);
    
        if (userInput.trim() && sessionManager && isStorageReady) {
            if (!sessionId) {
                const model = StorageService.getCurrentSessionModel() || StorageService.getDefaultModel() || "llama-3.1-8b-instant";
                const newSessionId = await sessionManager.createSession(model);
                setMessages([]);
                router.replace(`/c/${newSessionId}`);
                sessionId = newSessionId;
            }
    
            const urls = extractUrls(userInput);
            const inputWithoutUrls = removeUrls(userInput);
    
            if (urls.length > 0) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: "status", content: "Crawling URLs...", createdAt: new Date(), urls },
                ]);
    
                const crawl4AIService = new Crawl4AIService();
                const results = await crawl4AIService.fetch(urls);
                const markdownContext = "<context>" + results.map(r=>r.markdown).join("\n\n===============\n\n"); + "</context>"


                setMessages((prevMessages) => {
                    const updatedMessages = prevMessages; //prevMessages.filter((message) => message.role !== "status");
                    return [
                        ...updatedMessages,
                        { role: "user", content: inputWithoutUrls, createdAt: new Date(), context: markdownContext },
                    ];
                });
    
                sessionManager.updateSession(sessionId, {
                    role: "user",
                    content: inputWithoutUrls,
                    context: markdownContext,
                });
            } else {
                sessionManager.updateSession(sessionId, { role: "user", content: userInput }).then(() => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { role: "user", content: userInput, createdAt: new Date() },
                    ]);
                    setUserInput("");
                });
            }
        }
    };

    // Effect to call GroqService whenever messages change
    useEffect(() => {
        const handleAssistantResponse = async () => {
            if (messages.length > 0 && messages[messages.length - 1].role === "user") {
                console.log(messages)
                const model = StorageService.getCurrentSessionModel() || "llama-3.1-8b-instant";
                const systemPrompt = StorageService.getSystemPrompt() || "";
                const groqService = new GroqService();
                let cleanMessages = messages.map(({ role, content }) => ({ role, content }));
                // Check if last message has context, then take it
                const context = messages[messages.length - 1].context;

                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: "assistant", content: "", createdAt: new Date() },
                ]);

                // const chatCompletion = "Echo: " + messages[messages.length - 1].content + messages[messages.length - 1].context
                
                const chatCompletion = await groqService.getChatCompletion(model, systemPrompt, cleanMessages, true, context);

                let assistantResponse = "";

                for await (const chunk of chatCompletion) {
                    const token = chunk.choices[0]?.delta?.content || "";
                    assistantResponse += token;

                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[updatedMessages.length - 1].content = assistantResponse;
                        return updatedMessages;
                    });
                }

                sessionManager
                    .updateSession(sessionId, { role: "assistant", content: assistantResponse })
                    .then(() => {
                        console.log("Session updated successfully");
                    })
                    .catch((error) => {
                        console.error("Error updating session:", error);
                    });
            }
        };

        handleAssistantResponse();
    }, [messages]); // Dependency array includes messages

    const handleEditMessage = async (messageIndex: number, editedContent: string) => {
        if (sessionManager && isStorageReady) {
            await sessionManager.createThreadFromPosition(sessionId, messageIndex, editedContent);
            const session = await sessionManager.getSession(sessionId);
            if (session) {
                setMessages(session.messages);
            }
        }
    };

    return (
        <div className="flex flex-col text-zinc-300 h-screen overflow-hidden">
            <MessageBox messages={messages} setHasAnswered={setHasAnswered} handleEditMessage={handleEditMessage} />
            <InputForm userInput={userInput} setUserInput={setUserInput} handleUserInput={handleUserInput} />
        </div>
    );
};

export default ChatWindow;
