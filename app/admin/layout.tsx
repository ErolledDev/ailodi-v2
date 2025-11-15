import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protection is handled by middleware.ts
  // This layout is only reached after middleware authentication
  return <>{children}</>;
}
