import { IdeWorkbench } from "./IdeWorkbench";

export default function IdePreviewPage() {
  return (
    <main className="arch-shell min-h-screen">
      <div className="arch-backdrop" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <IdeWorkbench />
      </div>
    </main>
  );
}
