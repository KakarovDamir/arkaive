import React from 'react';
import { useTranslations } from 'next-intl';

const Footer = () => {
    const t = useTranslations('Footer');
    return (
        <footer className="bg-zinc-950 text-gray-400 py-6 border-t border-gray-900 mt-4">
            <div className="container mx-auto px-2 sm:px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-2">{t('aboutUs')}</h3>
                        <p className="text-gray-500 text-opacity-80">
                            {t('p5')}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">{t('teamName')}</h3>
                        <p className="text-gray-500 text-opacity-80">3К</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">{t('teamMembers')}</h3>
                        <ul className="text-gray-500 text-opacity-80">
                            <li>Какаров Дамир</li>
                            <li>Кайназаров Жасулан</li>
                            <li>Казбек Жибек</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
