"use client";

import { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout"; // Ensure you have the correct path for imported components
import { useParams } from 'next/navigation'

const SessionPage = () => {
    const [hasAnswered, setHasAnswered] = useState(false);
    const params = useParams<{ sessionId: string }>();
    const { sessionid } = params;

    return <MainLayout sessionId={sessionid as string} hasAnswered={hasAnswered} setHasAnswered={setHasAnswered} />;
};

export default SessionPage;
