import Chat from '@/components/chat';
import { WavyBackground } from '@/components/ui/wavy-background';

export const runtime = 'edge';

export default function Home() {
  return (
    <WavyBackground className="max-w-4xl mx-auto">
      <Chat />
    </WavyBackground>
  );
}
