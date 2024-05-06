import React, { useState } from "react";
import {
    PaperAirplaneIcon,
    
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import IdeasPanel from "../components/IdeasPanel";
import ModelSelector from '../components/ModelSelector';

const Home = () => {
    const [hasAnswered, setHasAnswered] = useState(false);
    return (
        <div className="h-screen bg-zinc-800 text-zinc-300 flex">
            <Sidebar />

            <div className="relative flex flex-1 flex-col h-full text-zinc-400">
            <ModelSelector />
                <IdeasPanel hasAnswered={hasAnswered} />
                <ChatWindow setHasAnswered={setHasAnswered} />
            </div>
        </div>
    );
};

export default Home;
