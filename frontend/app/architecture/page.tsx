'use client';

import dynamic from 'next/dynamic';

// Dynamically import the architecture page to reduce initial bundle size
const ArchitecturePage = dynamic(() => import('@/components/ArchitecturePage'), {
  loading: () => (
    <div className="min-h-screen bg-darkblue flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function Page() {
  return <ArchitecturePage />;
}