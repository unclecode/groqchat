import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <div className="w-full h-screen flex justify-center items-center flex-col space-y-4">
                <div>
                    <Image src="/logo.svg" alt="open AI Logo" width={40} height={40} />
                </div>
                <div className="flex flex-col justify-center items-center space-y-2">
                    <p>Welcome to ChatGPT</p>
                    <p>Log in with your openAI account to continue</p>
                    <div className="flex justify-center items-center space-x-4 my-4">
                        <Link href="/login" className="bg-teal-600 hover:bg-teal-700 p-2 rounded-md text-white px-2">
                            Log in
                        </Link>
                        <Link href="/login" className="bg-teal-600 hover:bg-teal-700 p-2 rounded-md text-white px-2">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
