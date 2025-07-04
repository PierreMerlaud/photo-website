export function Footer() {
  return (
    <footer className="text-muted-foreground w-full border-t border-neutral-200 px-6 py-6 text-center text-xs dark:border-neutral-800">
      © {new Date().getFullYear()} Mon Portfolio. Tous droits réservés.
    </footer>
  );
}
