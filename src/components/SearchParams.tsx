'use client';

import { useSearchParams } from 'next/navigation';

export function SearchParamsWrapper({
  children,
}: {
  children: (projectId: string | null) => React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  return <>{children(projectId)}</>;
}
