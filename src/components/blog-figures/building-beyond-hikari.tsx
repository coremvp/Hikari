export function BuildingBeyondHikariFigure({
  screenshotSrc = '/blog/coremvp-dashboard-top.webp',
  logoSrc = '/blog/coremvp.svg',
}: {
  screenshotSrc?: string;
  logoSrc?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 630"
      width="1200"
      height="630"
      role="img"
      aria-labelledby="coremvp-dashboard-title coremvp-dashboard-description"
      className="block h-auto w-full"
      fontFamily="Arial, Helvetica, sans-serif"
    >
      <title id="coremvp-dashboard-title">CoreMVP dashboard preview</title>
      <desc id="coremvp-dashboard-description">
        The top half of the CoreMVP public demo dashboard, showing workspace and
        Project navigation and the audience globe. This preview uses sample
        data.
      </desc>
      <defs>
        <clipPath id="coremvp-dashboard-crop">
          <rect x="180" y="315" width="840" height="330.75" rx="12" />
        </clipPath>
      </defs>
      <rect width="1200" height="630" fill="white" />
      <image href={logoSrc} x="466" y="125" width="56" height="56" />
      <text x="539" y="170" fill="#171717" fontSize="54" letterSpacing="-1.5">
        coremvp
      </text>
      <rect
        x="180"
        y="315"
        width="840"
        height="330.75"
        rx="12"
        fill="#f5f5f5"
        stroke="#e5e5e5"
      />
      <image
        href={screenshotSrc}
        x="180"
        y="315"
        width="840"
        height="330.75"
        clipPath="url(#coremvp-dashboard-crop)"
      />
    </svg>
  );
}
