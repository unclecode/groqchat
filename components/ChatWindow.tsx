// @ts-nocheck
// components/ChatWindow.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GroqService from "../services/GroqService";
import Crawl4AIService from "../services/Crawl4AIService";
import CrawlService from "../services/CrawlService";
import StorageService from "../services/StorageService";
import MessageBox from "../components/MessageBox";
import InputForm from "../components/InputForm";
import SessionManager from "../services/SessionManager";
import Attachment from "../components/Attachment";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import IdeasPanel from "../components/IdeasPanel";
import { useParams } from 'next/navigation'

const extractUrls = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
};

const removeUrls = (text: string): string => {
    const urlRegex = /@(https?:\/\/[^\s]+)/g;
    // return text.replace(urlRegex, "").trim();
    // return text.replace(urlRegex, "").trim();
    // Remove @ and wrap url inside square brackets
    return text.replace(urlRegex, (url) => `[${url.slice(1)}]`);
};

interface CrawlResult {
    markdown: string;
}

interface ChatWindowProps {
    sessionId?: string;
    setHasAnswered: (hasAnswered: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ sessionId, setHasAnswered }) => {
    const router = useRouter();
    const params = useParams<{ sessionId: string }>("");
    const [messages, setMessages] = useState<
        { role: "user" | "assistant"; content: string; createdAt: Date; liked?: boolean }[]
    >([]);
    const [userInput, setUserInput] = useState("");
    const [sessionManager, setSessionManager] = useState<SessionManager | null>(null);
    const [isStorageReady, setIsStorageReady] = useState(false);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [showAttachments, setShowAttachments] = useState(false);

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

    useEffect(() => {
        const fetchAttachments = async () => {
            if (sessionManager && isStorageReady && sessionId) {
                const attachmentsData = await sessionManager.getAttachments(sessionId);
                setAttachments(attachmentsData);
                setShowAttachments(attachmentsData?.length > 0);
            }
        };

        fetchAttachments();
    }, [sessionManager, isStorageReady, sessionId]);

    const handleUserInput = async (e : any) => {
        e?.preventDefault();
        setHasAnswered(true);

        if (userInput.trim() && sessionManager && isStorageReady) {
            if (!sessionId) {
                const model =
                    StorageService.getCurrentSessionModel() || StorageService.getDefaultModel() || "llama-3.1-8b-instant";
                const newSessionId = await sessionManager.createSession(model);
                setMessages([]);
                router.replace(`/c/${newSessionId}`);
                sessionId = newSessionId;
            }

            // Any URL followed by @ will be considered as a URL to be crawled
            const urls = extractUrls(userInput);
            const inputWithoutUrls = removeUrls(userInput);

            const urlsToFetch = urls.filter((url) => !attachments.find((attachment) => attachment.source === url));
            if (urlsToFetch.length > 0) {
                // const crawl4AIService = new Crawl4AIService();
                // const results = await crawl4AIService.fetch(urlsToFetch);
                const results: CrawlResult[] = await CrawlService.fetch(urlsToFetch);

                const newAttachments : any[] = [];
                results.forEach((result, index) => {
                    if (result && result.markdown && urlsToFetch[index]) {
                        const attachment = {
                            sessionId,
                            messageIndex: messages.length,
                            source: urlsToFetch[index],
                            content: result.markdown,
                            active: true,
                        };
                        newAttachments.push(attachment);
                        sessionManager.createAttachment(sessionId, messages.length, urlsToFetch[index], result.markdown);
                    }
                });
            
            

                setAttachments((prevAttachments) => [...prevAttachments, ...newAttachments]);
                setShowAttachments(true);
            }


            await sessionManager.updateSession(sessionId, { role: "user", content: inputWithoutUrls });
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: "user", content: inputWithoutUrls, createdAt: new Date() },
            ]);
            setUserInput("");
        }
    };

    const handleAssistantResponse = async () => {
        if (messages.length > 0 && messages[messages.length - 1].role === "user") {
            console.log(messages);
            const model = StorageService.getCurrentSessionModel() || "llama-3.1-8b-instant";
            const systemPrompt = StorageService.getSystemPrompt() || "";
            const groqService = new GroqService();
            let cleanMessages = messages.map(({ role, content }) => ({ role, content }));

            const activeAttachments = attachments?.filter((attachment) => attachment.active);
            const context = activeAttachments?.map((attachment) => attachment.content).join("\n\n");

            setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: "", createdAt: new Date() }]);

            const chatCompletion = await groqService.getChatCompletion(
                model,
                systemPrompt,
                cleanMessages,
                true,
                context
            );

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

            await sessionManager.updateSession(sessionId, { role: "assistant", content: assistantResponse });
        }
    };

    useEffect(() => {
        handleAssistantResponse();
    }, [messages]);

    const handleEditMessage = async (messageIndex: number, editedContent: string) => {
        if (sessionManager && isStorageReady) {
            await sessionManager.createThreadFromPosition(sessionId, messageIndex, editedContent);
            const session = await sessionManager.getSession(sessionId);
            if (session) {
                setMessages(session.messages);
            }
        }
    };

    const handleToggleAttachmentActive = async (attachmentIndex: number) => {
        const updatedAttachments = [...attachments];
        updatedAttachments[attachmentIndex].active = !updatedAttachments[attachmentIndex].active;
        setAttachments(updatedAttachments);

        await sessionManager.updateAttachment(sessionId, attachmentIndex, updatedAttachments[attachmentIndex].active);
    };

    const handleDeleteAttachment = async (attachmentIndex: number) => {
        const updatedAttachments = [...attachments];
        updatedAttachments.splice(attachmentIndex, 1);
        setAttachments(updatedAttachments);

        // if no attachments left, hide the attachments panel
        setShowAttachments(updatedAttachments.length > 0);

        await sessionManager.deleteAttachment(sessionId, attachmentIndex);
    };

    return (
        <div className="flex text-zinc-300 h-screen overflow-hidden">
            <div className={`flex flex-col flex-1 transition-transform duration-300 ease-in-out transform `}
                style={{ width: showAttachments ? "calc(100% - 16rem)" : "100%" }}
                // style = {{ paddingRight: showAttachments ? "16rem" : "0" }}
                // style={{ left: showAttachments ? "-calc(100% + 10rem)" : "-10rem" }}
            >
                { !params.sessionid ? (
                    <IdeasPanel/>
                ) : null }

                <MessageBox messages={messages} setHasAnswered={setHasAnswered} handleEditMessage={handleEditMessage} />
                <InputForm userInput={userInput} setUserInput={setUserInput} handleUserInput={handleUserInput} />
            </div>
            <div className="relative" >
                <button
                    className="absolute top-4 text-gray-400 hover:text-gray-200 focus:outline-none z-20 transition-all "
                    style={{ right: showAttachments ? "calc(100% + 1rem)" : "1rem" }}
                    onClick={() => setShowAttachments(!showAttachments)}
                >
                    {showAttachments ? (
                        <ChevronRightIcon className="h-6 w-6" />
                    ) : (
                        <ChevronLeftIcon className="h-6 w-6" />
                    )}
                </button>
                <div
                    className={`attachments-list absolute right-0 w-64 bg-zinc-800 p-4 transition-transform duration-300 ease-in-out transform border-l border-zinc-700 h-full ${
                        showAttachments ? "translate-x-0" : "translate-x-full"
                    } shadow-lg`}
                >
                    <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                    {(attachments || []).map((attachment, index) => (
                        <Attachment
                            key={index}
                            attachment={{ ...attachment, index }}
                            onToggleActive={handleToggleAttachmentActive}
                            onDelete={handleDeleteAttachment}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
