import '../styles/globals.css'
import 'prismjs/themes/prism-okaidia.css';
import 'katex/dist/katex.min.css'; 

// import { Html, Head, Main, NextScript } from "next/document";
export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>My App</title>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin = "anonymous"/>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet"/>

        </head>
        <body suppressHydrationWarning={true}>{children}</body>
      </html>
    )
  }


