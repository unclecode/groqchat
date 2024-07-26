// @ts-nocheck
import React from 'react';

export class CrawlService {
  static async fetch(urls: string[]): Promise<Array<{ url: string; markdown: string }>> {
    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });

      if (!response.ok) {
        throw new Error('Failed to crawl URLs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in CrawlService:', error);
      throw error;
    }
  }
}

// Example usage in a React component
const CrawlExample: React.FC = () => {
  const [results, setResults] = React.useState<Array<{ url: string; markdown: string }>>([]);

  const handleCrawl = async () => {
    try {
      const urls = ['https://example.com', 'https://another-example.com'];
      const crawlResults = await CrawlService.fetch(urls);
      setResults(crawlResults);
    } catch (error) {
      console.error('Error crawling URLs:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCrawl}>Crawl URLs</button>
      {results.map((result, index) => (
        <div key={index}>
          <h3>{result.url}</h3>
          <pre>{result.markdown}</pre>
        </div>
      ))}
    </div>
  );
};

export default CrawlService;