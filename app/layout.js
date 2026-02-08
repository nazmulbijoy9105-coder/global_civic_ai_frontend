export const metadata = {
  title: 'Global Civic AI',
  description: 'Global Civic AI Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
