'use client';

import {
  Activity,
  BadgeInfo,
  BookA,
  ChartNoAxesCombined,
  CircleUserRound,
  CreditCard,
  FileLock,
  Home,
  Layers,
  Lock,
  Mail,
  ShieldCheck,
  UserCircle,
  X
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const MobileNav = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/en', icon: Home, label: 'Home' },
    { href: '/en/markets', icon: ChartNoAxesCombined, label: 'Markets' },
    { href: '/en/trade', icon: Activity, label: 'Trade' },
    { href: '/en/assets', icon: BookA, label: 'Assets' },
    { href: '/en/primary-certification', icon: ShieldCheck, label: 'Primary Certification' },
    { href: '/en/real-name-authentication', icon:CircleUserRound, label: 'Real-name Authentication' },
    { href: '/en/bind-card-bank', icon:CreditCard, label: 'Bind Bank Card' },
    { href: '/en/set-fund-password', icon:FileLock, label: 'Set Fund Password' },
    { href: '/en/set-login-password', icon:Lock, label: 'Set Login Password' },
    { href: '/en/email-authentication', icon:Mail, label: 'Email Authenticaion' },
    { href: '/en/service-terms', icon:Layers, label: 'Service Terms' },
    { href: '/en/help-center', icon:BadgeInfo, label: 'Help Center' },
    // { href: '/en/e', icon:Globe, label: 'English' },
  ];

  return (
    <div className="lg:hidden">
      {/* Header */}
      <header className="py-3 flex items-center justify-between px-5">
        <div className="logo mr-10">
          <Link href="/">
            <h3 className="text-primary-100 font-semibold">
              <span className="text-xl font-bold">B</span>ack
              <span className="text-xl font-bold">P</span>ack{' '}
              <span className="text-xl font-bold">E</span>xchange
            </h3>
          </Link>
        </div>
        <div>
          <UserCircle
            className="cursor-pointer text-green-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
      </header>

      {/* Bottom Tab Nav */}
      <div className="fixed bottom-0 bg-gray-900 w-full grid grid-cols-4 gap-x-2 z-50">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-center py-5 ${
                isActive ? 'text-green-500 font-semibold' : 'text-white'
              }`}
            >
              {Icon && <Icon className="mx-auto" />}
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Mobile Sidebar (Full Width) */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-gray-900 text-white z-[100] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-end px-6 py-6 border-b border-gray-900">
          <button
            className="text-white text-2xl ml-2 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X/>
          </button>
        </div>
        {/* User info  */}
        <div className='px-6 mb-3'>
          <h4 className='text-xl font-medium'>Email: Ofg4349535dretd3423dssfasdtCgegd</h4>
          <h4 className='text-xl font-medium'>UID: 5295</h4>
          <p className='text-gray-500'>Credit Score: 100</p>
        </div>

        {/* Menu Items */}
        <div className="overflow-y-auto h-full">
          <ul className="flex flex-col px-6 pt-6 space-y-4">
            {navItems.slice(4).map((item) => {
              const Icon = item.icon;
            return(
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-semibold flex gap-x-3 ${
                    pathname === item.href
                      ? 'text-yellow-400'
                      : 'hover:text-yellow-300'
                  }`}
                >
                  {Icon && <Icon/>}
                   {item.label}
                </Link>
              </li>
            )
            }
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
