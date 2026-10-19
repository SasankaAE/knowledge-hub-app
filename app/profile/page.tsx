import { ProfileView } from "@/components/profile-view";

export const metadata = { title: "Profile | Knowledge Hub" };

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <ProfileView />
    </main>
  );
}