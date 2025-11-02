"use client";

import Link from "next/link";

const FooterLinkCard = ({ title, items }) => {
  return (
    <>
      <div className="mt-4 lg:mt-0 hidden md:block">
        <h4 className="text-lg font-semibold mb-4">{title}</h4>
        <ul className="flex flex-col">
          {items?.map((item, i) => (
            <Link
              prefetch
              key={i}
              className="capitalize font-medium text-sm mb-2 last:mb-0"
              href="#"
            >
              {item?.title}
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FooterLinkCard;
