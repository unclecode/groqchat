import React, { useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "../layout/MainLayout";

const Home = () => {
  const [hasAnswered, setHasAnswered] = useState(false);
  const router = useRouter();
  const { sessionId } = router.query;

  return (
    <MainLayout sessionId={sessionId as string} hasAnswered={hasAnswered} setHasAnswered={setHasAnswered} />
  );
};

export default Home;
