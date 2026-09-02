import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  title: string;
  currentPage: string;
  backgroundImage?: string;
  subtitle?: string;
}

const Breadcrumb = ({
  title,
  currentPage,
  subtitle = "Welcome to Tuz Maz Jamla",
  backgroundImage = "/img/home-banner/4.jpg",
}: BreadcrumbProps) => {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto flex h-80 max-w-7xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm text-white backdrop-blur tracking-wider">
          {subtitle}
        </span>

        <h1 className="mb-5 text-4xl font-bold text-white md:text-6xl font-serif">
          {title}
        </h1>

        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur">
          <Link
            href="/"
            className="flex items-center gap-1 text-white hover:text-cyan-300"
          >
            <Home size={16} />
            Home
          </Link>

          <ChevronRight className="text-white" size={16} />

          <span className=" text-rose-100">{currentPage}</span>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
