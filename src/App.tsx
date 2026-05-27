import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Blog from './components/Blog';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminApp from './admin/AdminApp';

function PublicSite() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <WhyUs />
      <Blog />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(window.location.pathname.startsWith('/admin'));
    const onNav = () => setIsAdmin(window.location.pathname.startsWith('/admin'));
    window.addEventListener('popstate', onNav);
    return () => window.removeEventListener('popstate', onNav);
  }, []);

  return isAdmin ? <AdminApp /> : <PublicSite />;
}
