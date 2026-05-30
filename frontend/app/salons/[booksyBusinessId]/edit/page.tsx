type Props = {
  params: Promise<{ booksyBusinessId: string }>;
};

export default async function EditSalonPage({ params }: Props) {
  const { booksyBusinessId } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Edit salon #{booksyBusinessId}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-300">
        Placeholder page. Edit form will be added here.
      </p>
    </main>
  );
}
