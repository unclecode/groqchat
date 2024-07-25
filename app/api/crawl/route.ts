// app/api/crawl/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';
import TurndownService from 'turndown';

async function crawlUrl(url: string): Promise<{ url: string; markdown: string } | null> {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    $('script, style, comment').remove();

    let mainContent = $('main').html() || $('article').html() || $('body').html();

    if (!mainContent) {
      console.error(`No content found for ${url}`);
      return null;
    }

    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(mainContent);

    return { url, markdown };
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty URL list' }, { status: 400 });
    }

    const results = await Promise.all(urls.map(crawlUrl));
    const validResults = results.filter(result => result !== null);

    return NextResponse.json(validResults);
  } catch (error) {
    console.error('Error in crawl API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}