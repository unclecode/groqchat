// components/CrawlingStatus.tsx
import React, { useState, useEffect } from "react";
import { CheckCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

interface CrawlingStatusProps {
    urls: string[];
}

const CrawlingStatus: React.FC<CrawlingStatusProps> = ({ urls }) => {
    const [crawledUrls, setCrawledUrls] = useState<string[]>([]);

    useEffect(() => {
        const simulateCrawling = async () => {
            for (const url of urls) {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating crawling delay
                setCrawledUrls((prevCrawledUrls) => [...prevCrawledUrls, url]);
            }
        };

        simulateCrawling();
    }, [urls]);

    return (
        <div className="flex items-center p-3 my-6  w-full border border-zinc-700 rounded-lg text-gray-400">
            <div className="mr-2">Crawling URLs:</div>
            {urls.map((url, index) => (
                <div key={index} className="flex items-center mr-2">
                    {crawledUrls.includes(url) ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                        <Cog6ToothIcon className="h-4 w-4 text-gray-500 animate-spin" />
                    )}
                    <div className="ml-1">{url}</div>
                </div>
            ))}
        </div>
    );
};

export default CrawlingStatus;