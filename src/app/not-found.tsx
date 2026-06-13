import Link from "next/link";
import { NeoFibraLogo } from "@/components/neofibra-logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-chat-bg px-6 text-center">
      <NeoFibraLogo className="size-16" title="" />

      <div className="flex flex-col items-center gap-2">
        <p className="text-5xl font-bold tracking-tight text-wa-teal">404</p>
        <h1 className="text-lg font-semibold text-foreground">
          Página não encontrada
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          O endereço que você tentou abrir não existe ou foi movido. Volte para
          a lista de conversas e continue o atendimento.
        </p>
      </div>

      <Button asChild>
        <Link href="/">Voltar para o inbox</Link>
      </Button>
    </div>
  );
}
