import Image from "next/image";

/**
 * The three states every page in the auth flow ends up in: it worked, it
 * didn't, or we're waiting on the user's inbox.
 */
const ICONS = {
  success: { src: "/success-green-check-mark-icon.svg", alt: "Success" },
  error: { src: "/red-x-line-icon.svg", alt: "Error" },
  email: { src: "/blue-mail-envelope-icon.svg", alt: "Email sent" },
} as const;

export type StatusIconName = keyof typeof ICONS;

interface StatusIconProps {
  name: StatusIconName;
  size?: number;
}

const StatusIcon = ({ name, size = 96 }: StatusIconProps) => {
  const { src, alt } = ICONS[name];

  return (
    // `unoptimized` because these are already-small static SVGs; the optimizer
    // has nothing to do and refuses to rasterise SVG anyway.
    <Image src={src} alt={alt} width={size} height={size} unoptimized priority className="mb-8" />
  );
};

export default StatusIcon;
