import { Arimo } from 'next/font/google'
import '../styles/globals.css'
import 'prismjs/themes/prism-okaidia.css';
import 'katex/dist/katex.min.css'; 

const arimo = Arimo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-arimo',
})

export const metadata = {
  title: 'GroqChat',
  description: `Groq Chat: A lightning-fast, browser-based chat interface for language models powered by Groq's LPU (Language Processing Unit). Experience ChatGPT-like conversations using Meta's LLAMA 3.1 series, with enhanced privacy and productivity features. Built with Next.js and Vercel, it offers URL attachment, speech-to-text, and local data storage—all without logins or servers.`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={arimo.variable}>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}