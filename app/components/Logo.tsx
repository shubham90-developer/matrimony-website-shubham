import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/img/logo/1.png"
      alt="Tuza Maza Jamla.com"
      width={180}
      height={50}
      priority
      className="h-12 w-auto"
    />
  );
};

export default Logo;
