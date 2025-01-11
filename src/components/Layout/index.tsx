import Image from "next/image";
import { Lato } from "next/font/google";
import Link from "next/link";
import Head from "next/head";
import { type ReactNode } from "react";
import DarkModeButton from "../DarkModeButton";
import { GITHUB_URL, NAME } from "../../../constants";

const lato = Lato({
  subsets: ['latin'],
  weight: ["400", "700"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={
        lato.className + " grid grid-rows-[auto_1fr_auto] min-h-screen bg-white text-black dark:bg-black dark:text-white"
      }
    >
      <Head>
        <title>{NAME}</title>
      </Head>
      <header className="py-4 px-6 border-b-gray-800 dark:border-b-white border-b-solid border-b-2 flex justify-center">
        <div className="container flex justify-between">
          <Link
            href="/"
            className="text-xl flex gap-2 items-center text-nowrap col-span-3"
          >
            <Image
              className="invert dark:invert-0"
              src="/images/logo-white.svg"
              alt="Icon."
              width={20}
              height={20}
            />{" "}
            {NAME}
          </Link>
          <div className="hidden md:flex items-center gap-4 justify-end">
            <Link
              href="https://jobs.ashbyhq.com/Silver?utm_source=Pedw1mQEZd"
              className="text-sm dark:text-white hover:text-black/80 dark:hover:text-white/80 cursor-pointer hover:text-indigo-300"
            >
              Jobs
            </Link>
            <Link
              href="https://ready.silver.dev/"
              className="text-sm dark:text-white hover:text-black/80 dark:hover:text-white/80 cursor-pointer hover:text-indigo-300"
            >
              Interview Ready
            </Link>
            <Link
              href="privacy"
              className="text-sm dark:text-white hover:text-black/80 dark:hover:text-white/80 cursor-pointer hover:text-indigo-300"
            >
              Privacy Policy
            </Link>
            <Link
              href={GITHUB_URL}
              className="flex items-center"
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 97.6 96"
                className="w-5 h-5"
              >
                <path
                  fill="currentColor"
                  d="M48.9,0C21.8,0,0,22,0,49.2C0,71,14,89.4,33.4,95.9c2.4,0.5,3.3-1.1,3.3-2.4c0-1.1-0.1-5.1-0.1-9.1
	c-13.6,2.9-16.4-5.9-16.4-5.9c-2.2-5.7-5.4-7.2-5.4-7.2c-4.4-3,0.3-3,0.3-3c4.9,0.3,7.5,5.1,7.5,5.1c4.4,7.5,11.4,5.4,14.2,4.1
	c0.4-3.2,1.7-5.4,3.1-6.6c-10.8-1.1-22.2-5.4-22.2-24.3c0-5.4,1.9-9.8,5-13.2c-0.5-1.2-2.2-6.3,0.5-13c0,0,4.1-1.3,13.4,5.1
	c3.9-1.1,8.1-1.6,12.2-1.6s8.3,0.6,12.2,1.6c9.3-6.4,13.4-5.1,13.4-5.1c2.7,6.8,1,11.8,0.5,13c3.2,3.4,5,7.8,5,13.2
	c0,18.9-11.4,23.1-22.3,24.3c1.8,1.5,3.3,4.5,3.3,9.1c0,6.6-0.1,11.9-0.1,13.5c0,1.3,0.9,2.9,3.3,2.4C83.6,89.4,97.6,71,97.6,49.2
	C97.7,22,75.8,0,48.9,0z"
                />
              </svg>
            </Link>
            <DarkModeButton />
          </div>
        </div>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center py-6 px-2">
        {children}
      </main>
    </div>
  );
}