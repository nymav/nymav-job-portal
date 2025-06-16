import React from "react";
import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/img/logo.png"
        alt="Logo"
        width={48}
        height={48}
        className="object-contain rounded-lg shadow-lg filter drop-shadow-lg"
        priority
      />
    </div>
  );
};