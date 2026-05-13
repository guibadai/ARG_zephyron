import "./globals.css";

export const metadata = {
  title: "Observadores",
  description: "ARG Zephyron",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}