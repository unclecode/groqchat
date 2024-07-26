// @ts-nocheck
// services/Crawl4AIService.ts
import StorageService from "./StorageService";
class Crawl4AIService {
    async fetch_(urls: string[]): Promise<{ markdown: string }> {
        // Simulating a 2-second delay
        await new Promise((resolve) => setTimeout(resolve, 10000));

        // Returning a simple word "CONTEXT" for now
        return { markdown: "CONTEXT" };
    }

    async fetch(urls): Promise<{ markdown: string }> {
        
        const data = {
            urls: urls,
            // provider_model: "openai/gpt-3.5-turbo",
            // api_token: StorageService.getOpenAIWhisperAPIToken(),
            // include_raw_html: false,
            bypass_cache: false,
            extract_blocks: false,
            // word_count_threshold: 10
        };

        try {
            const response = await fetch("https://crawl4ai.com/crawl", {
            // const response = await fetch("https://crawl4ai.uccode.io/crawl", {
            // const response = await fetch("http://0.0.0.0:8000/crawl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData.results;
        } catch (error) {
            console.error("Error crawling URLs:", error);
            throw error;
        }
    }

}

export default Crawl4AIService;