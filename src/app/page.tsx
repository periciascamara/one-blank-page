import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Showcase from '@/components/landing/Showcase'
import Plans from '@/components/landing/Plans'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <Plans />
      </main>
      <Footer />
    </>
  )
}
