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
  title: 'My App',
  description: 'Description of my app',
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