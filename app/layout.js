import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Global Civic AI",
  description: "Civic & Financial Awareness Platform powered by AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
