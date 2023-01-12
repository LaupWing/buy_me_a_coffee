import "../../styles/globals.css"

interface Props {
   children: React.ReactNode
}

export default function RootLayout({
   children,
}: Props) {
   return (
      <html>
         <head />
         <body className="w-screen h-screen bg-red-400">{children}</body>
      </html>
   )
}
