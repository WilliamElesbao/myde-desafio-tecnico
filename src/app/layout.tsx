import type { Metadata } from "next";
import "../styles/globals.css";
import type { PropsWithChildren } from "react";
import { Providers } from "../providers/providers";

export const metadata: Metadata = {
  title: "Inbox de Atendimento — Desafio Frontend",
  description: "Desafio técnico frontend Myde",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
