import { ChatView } from '@/app/chat/[id]/_component/ChatView';

export default async function Page({ params }: PageProps<'/chat/[id]'>) {
  const id = (await params).id;

  return <ChatView id={id} />;
}
