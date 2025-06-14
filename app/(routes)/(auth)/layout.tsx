import '@/app/globals.css';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='pt-14'>{children}</body>
    </html>
  );
}
