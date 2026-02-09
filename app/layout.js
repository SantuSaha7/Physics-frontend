import "./globals.css";

export const metadata = {
  title: "Physics By Santu Sir",
  description: "Student Physics Learning Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
