import { Inter } from "next/font/google";
import "./globals.css";
import { dbConnect } from "@/utils/mongo";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Next App with Auth",
    description: "Next js boilerplate",
};

export default async function RootLayout({ children }) {
    // const connect = await dbConnect();
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <SessionProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Navbar />
                        {children}
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
