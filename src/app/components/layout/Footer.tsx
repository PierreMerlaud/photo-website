export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 py-6 px-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Mon Portfolio. Tous droits réservés.
    </footer>
  );
}
