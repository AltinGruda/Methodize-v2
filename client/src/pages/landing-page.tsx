import Header from '@/components/landing-page/Header';
import HeroHome from '@/components/landing-page/HeroHome';
import FeaturesHome from '@/components/landing-page/Features';
import FeaturesBlocks from '@/components/landing-page/FeaturesBlocks';
import Testimonials from '@/components/landing-page/Testimonials';
import Newsletter from '@/components/landing-page/Newsletter';
import Footer from '@/components/landing-page/Footer';
import 'aos/dist/aos.css';
import '../css/style.css';

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Aos from 'aos';

export const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    Aos.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
  });

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change


  return (
    <div className="flex flex-col min-h-screen overflow-hidden col-span-5">

    {/*  Site header */}
    <Header />

    {/*  Page content */}
    <main className="flex-grow">

      {/*  Page sections */}
      <HeroHome />
      <FeaturesHome />
      <FeaturesBlocks />
      <Testimonials />

    </main>


    {/*  Site footer */}
    <Footer />

    </div>    
  )
}