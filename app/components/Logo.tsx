import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="inline-flex items-center">
      <Image
        src="/img/logo/1.svg"
        alt="Jeevansathi"
        width={180}
        height={50}
        priority
        className="h-12 w-auto"
      />
    </Link>
  );
};

export default Logo;
