import Chat from '@/components/chat';
import { NavbarMenu } from '@/components/menu';
import { WavyBackground } from '@/components/ui/wavy-background';

export const runtime = 'edge';

export default function Home() {
  return (
    <WavyBackground className="max-w-4xl mx-auto">
      <NavbarMenu />
      <Chat />
    </WavyBackground>
  );
}
