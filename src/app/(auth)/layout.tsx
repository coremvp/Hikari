export const metadata = { robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-svh bg-white text-neutral-950 md:grid-cols-2">
      {children}
      <div className="relative hidden min-h-svh bg-neutral-100 p-8 md:block lg:p-10">
        <div className="max-w-xs">
          <p className="text-sm font-medium text-neutral-500">
            Hikari by CoreMVP
          </p>
          <p className="mt-2 text-2xl font-normal tracking-tight">
            A foundation for your next application.
          </p>
        </div>
      </div>
    </main>
  );
}
