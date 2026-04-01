export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout sin Navbar para páginas de autenticación
  return <>{children}</>;
}
