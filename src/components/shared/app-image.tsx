import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type StaticImageData = string;

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
};

/** Plain <img> replacement for the source project's image component. */
export default function Image({ src, fill, priority, quality: _q, placeholder: _ph, className, ...rest }: Props) {
  return (
    <img
      src={src}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
      {...rest}
    />
  );
}
