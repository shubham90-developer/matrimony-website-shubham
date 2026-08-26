import Image from "next/image";
import React from "react";

const lifePhotos = [
  "/img/careers/1.jpg",
  "/img/careers/2.jpg",
  "/img/careers/3.jpg",
  "/img/careers/4.jpg",
  "/img/careers/5.jpg",
];

const LifePhotos = () => {
  return (
    <>
      <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {lifePhotos.map((src, i) => (
          <div
            key={src}
            className={`relative overflow-hidden rounded-2xl ${
              i === 0 ? "col-span-2 row-span-2" : ""
            } h-32 sm:h-40 ${i === 0 ? "sm:h-84" : ""}`}
          >
            <Image
              src={src}
              alt="Life at our company"
              fill
              className="object-cover transition duration-500 hover:scale-105"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default LifePhotos;
