"use client"

import React, { useState } from "react";

import MainLayout from "../layout/MainLayout";

const Home = () => {
  const [hasAnswered, setHasAnswered] = useState(false);

  const sessionId = "";

  return (
    <MainLayout sessionId={sessionId} hasAnswered={hasAnswered} setHasAnswered={setHasAnswered} />
  );
};

export default Home;
