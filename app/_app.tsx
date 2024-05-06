import '../styles/globals.css'
import 'prismjs/themes/prism-okaidia.css';
import 'katex/dist/katex.min.css'; 
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
