export function Header() {
  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-800 py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Mon Portfolio</h1>
      <nav className="flex gap-4 text-sm">
        <a href="/">Accueil</a>
        <a href="/galerie">Galerie</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
}
