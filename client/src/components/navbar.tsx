'use client';
import React, { ChangeEvent, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Poppins } from '@next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const Navbar: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localeActive = useLocale();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(`/${nextLocale}`);
    });
  };

  return (
    <nav className={`${poppins.className} bg-black shadow-md fixed top-0 z-50 w-full`}>
      <div className="container flex items-center justify-between mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 sm:space-x-2">
          <Image src="/icon.ico" alt="VisionDeck Icon" width={60} height={20} className="rounded-full sm:w-12 sm:h-12" />
          <Link href="/" className="text-white hover:text-gray-300 text-xl sm:text-2xl lg:text-3xl font-bold">ArchiTech</Link>
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <label className="relative flex items-center space-x-2 rounded-lg px-2 py-1 sm:px-3 sm:py-2 bg-black shadow-sm transition duration-300 ease-in-out transform hover:scale-105 w-24 sm:w-auto">
            <p className="sr-only">Change language</p>
            <select
              defaultValue={localeActive}
              className="bg-black py-1 sm:py-0.5 focus:outline-none p-2 rounded-md w-full text-white border border-white"
              onChange={onSelectChange}
              disabled={isPending}
            >
              <option value="eng">🇬🇧 EN</option>
              <option value="rus">🇷🇺 RU</option>
              <option value="kaz">🇰🇿 KZ</option>
            </select>
          </label>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
