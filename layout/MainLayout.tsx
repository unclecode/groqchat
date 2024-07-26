import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import IdeasPanel from "../components/IdeasPanel";
import ModelSelector from "../components/ModelSelector";
import OnboardingModal from "../components/OnboardingModal";
import StorageService from "../services/StorageService";

const MainLayout = ({ sessionId, hasAnswered, setHasAnswered }) => {
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const groqAPIToken = StorageService.getGroqAPIToken();
        if (!groqAPIToken) {
            setShowOnboarding(true);
        }
    }, []);

    // If sessionId is falsy, use an empty string
    const safeSessionId = sessionId || "";

    return (
        <div className="h-screen bg-zinc-800 text-zinc-300 flex">
            <Sidebar />

            <div className="flex flex-1 flex-col h-full text-zinc-400 ">
                <ModelSelector />
                {/* <IdeasPanel hasAnswered={hasAnswered} /> */}
                <ChatWindow sessionId={safeSessionId} setHasAnswered={setHasAnswered} />
            </div>
            <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
        </div>
    );
};

export default MainLayout;
