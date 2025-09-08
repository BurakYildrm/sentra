export function ErrorPage({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <h1 className="text-2xl font-bold text-destructive">Error</h1>
      <p className="text-muted-foreground">{error}</p>
    </div>
  );
}
