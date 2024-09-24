'use client';

import { HandwritingRecognitionComponent } from "@/components/components-handwriting-recognition";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from 'next/image';
import { Poppins } from '@next/font/google';
import { useTranslations } from 'next-intl';
import { Typewriter } from 'react-simple-typewriter';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const Home = () => {
  const t = useTranslations('Index');
  return (
    <div className={`${poppins.className} bg-black min-h-screen`}>
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4">
        <div className="relative w-full flex items-center mt-12 lg:mt-24">
          {/* Left Image: only shown on large screens (lg and above) */}
          <div className="absolute left-8 top-36 hidden lg:block">
            <Image 
              src="/left.png" 
              alt="Left Image"
              width={225}
              height={100}
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold mt-8 lg:mt-16 lg:mt-32 mx-auto text-center" style={{ fontFamily: 'Neue Machina', color: 'white' }}>
            <Typewriter
              words={[t('title')]}
              loop={1}
              typeSpeed={50}
              deleteSpeed={30}
            />
          </h1>
        </div>

        {/* Right Image: only shown on large screens (lg and above) */}
        <div className="absolute right-0 top-16 hidden lg:block">
          <Image
            src="/right.png"
            alt="Right Image"
            width={350}
            height={100}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center justify-center text-center mt-4 lg:mt-2 w-full md:w-3/4 lg:w-1/2">
          <p className="text-xl text-gray-400">
            {t('text')}
          </p>
        </div>

        {/* Handwriting Recognition Component */}
        <div className="mt-12 lg:mt-16 w-full">
          <HandwritingRecognitionComponent />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
