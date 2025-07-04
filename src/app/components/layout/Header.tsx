import Link from 'next/link';

export function Header() {
  return (
    <header className="flex w-full items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
      <h1 className="text-xl font-bold">Mon Porftolio</h1>
      <nav className="flex gap-4 text-sm">
        <Link href="/">Accueil</Link>
        <Link href="/galerie">Galerie</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
