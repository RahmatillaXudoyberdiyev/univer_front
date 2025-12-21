import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import Postfooter from '@/components/postfooter/postfooter'
import Prefooter from '@/components/prefooter/prefooter'
import Preheader from '@/components/preheader/preheader'
import Providers from '@/components/providers/providers'
import '../../globals.css'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <Preheader />
      <Header />
      {children}
      <Prefooter />
      <Footer />
      <Postfooter />
    </Providers>
  )
}
