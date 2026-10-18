import { WriteForm } from "@/components/write-form";

export const metadata = { title: "Write an article | Knowledge Hub" };

export default function WritePage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight">
        Write an article
      </h1>
      <WriteForm />
    </main>
  );
}