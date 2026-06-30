import { PageHeader } from "@/components/layout/PageHeader";
import { getConversations } from "@/lib/data";
import { ConversasClient } from "./ConversasClient";

export default function ConversasPage() {
  const conversations = getConversations();

  return (
    <>
      <PageHeader
        eyebrow="Canal de atendimento"
        title="Conversas"
        subtitle="Pedidos chegam pelo WhatsApp em texto livre. A IA interpreta e responde com a cotação automaticamente."
      />
      <ConversasClient conversations={conversations} />
    </>
  );
}
