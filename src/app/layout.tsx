import "../../styles/globals.css"

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html>
         <head />
         <body className="w-screen h-screen bg-red-400">{children}</body>
      </html>
   )
}
