import React from 'react';
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import IdeasPanel from "../components/IdeasPanel";
import ModelSelector from "../components/ModelSelector";

const MainLayout = ({ sessionId, hasAnswered, setHasAnswered }) => {
  return (
    <div className="h-screen bg-zinc-800 text-zinc-300 flex">
      <Sidebar />

      <div className="flex flex-1 flex-col h-full text-zinc-400 ">
        <ModelSelector />
        {/* <IdeasPanel hasAnswered={hasAnswered} /> */}
        <ChatWindow sessionId={sessionId} setHasAnswered={setHasAnswered} />
      </div>
    </div>
  );
};

export default MainLayout;
