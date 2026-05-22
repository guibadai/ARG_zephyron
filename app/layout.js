import "./globals.css";
import ArgAtmosphere from "@/components/ArgAtmosphere";

export const metadata = {
  title: "Observadores",
  description: "ARG Zephyron",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <ArgAtmosphere />
        {children}
      </body>
    </html>
  );
}
