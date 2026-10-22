'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import { Providers } from './Providers';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isStudio = pathname.includes('studio');

    if (isStudio)
        return (
            <html>
                <body>{children}</body>
            </html>
        );

    return (
        <html lang="en" className="dark" data-theme="silk">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
