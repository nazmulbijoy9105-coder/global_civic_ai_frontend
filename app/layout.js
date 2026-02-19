import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Global Civic AI",
  description: "Civic & Financial Awareness Platform powered by AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
