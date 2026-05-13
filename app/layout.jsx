import "./globals.css";

export const metadata = {
  title: "Sachnetra — Market Signal Intelligence",
  description: "India news signals dashboard — powered by FinBERT + Groq",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
