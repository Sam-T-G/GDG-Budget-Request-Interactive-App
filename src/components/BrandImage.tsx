import { useState, type ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
};

/**
 * Renders an image from `public/brand/` if present, otherwise renders `fallback`.
 * Used so the app stays polished when official chapter assets haven't been dropped in yet.
 */
export function BrandImage({ src, alt, className, fallback }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) return <>{fallback}</>;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
