import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Valentine V2 - A Romantic Experience",
    description: "A beautiful romantic web experience with password protection",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
