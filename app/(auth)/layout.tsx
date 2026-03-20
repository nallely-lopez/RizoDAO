export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F0EA] flex items-center justify-center px-4">
      {children}
    </div>
  );
}