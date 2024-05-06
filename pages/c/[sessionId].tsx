"use client";

import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout"; // Ensure you have the correct path for imported components

const SessionPage = () => {
    const [hasAnswered, setHasAnswered] = useState(false);
    const sessionId = document.location.href.split("/c/")[1];

    return <MainLayout sessionId={sessionId as string} hasAnswered={hasAnswered} setHasAnswered={setHasAnswered} />;
};

export default SessionPage;
