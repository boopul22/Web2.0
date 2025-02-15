import "./globals.css";

export const metadata = {
  title: "My Supabase Blog",
  description: "A simple blog built with Supabase and Next.js"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
