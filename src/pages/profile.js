import "../app/globals.css";
import Header from "@/components/header";

export default function Home() {
  return (
    <div>
      <main className="min-h-screen bg-zinc-900 text-zinc-200">
        <Header />
        The profile page
      </main>
    </div>
  );
}
