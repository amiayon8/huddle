import { redirect } from 'next/navigation';

export default async function DashboardRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const entries: [string, string][] = [];

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        entries.push([key, item]);
      }
    } else if (typeof value === 'string') {
      entries.push([key, value]);
    }
  }

  const queryString = new URLSearchParams(entries).toString();
  redirect(queryString ? `/app?${queryString}` : '/app');
}
