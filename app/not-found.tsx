import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="bg-background min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full">
              Go Home
            </Button>
          </Link>
          
          <Link href="/providers" className="block">
            <Button variant="outline" className="w-full">
              Browse Providers
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Need help? <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </main>
  );
}
