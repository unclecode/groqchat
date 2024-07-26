"use client";

import { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useParams } from 'next/navigation'

const SessionPage = () => {
    const [hasAnswered, setHasAnswered] = useState(false);
    const params = useParams<{ sessionid: string }>();
    const sessionId = params.sessionid;
    const safeSessionId = sessionId || "";

    return <MainLayout sessionId={safeSessionId} hasAnswered={hasAnswered} setHasAnswered={setHasAnswered} />;
};

export default SessionPage;