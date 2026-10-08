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
      <rect width="1200" height="630" fill="white" />
      <image href={logoSrc} x="492" y="24" width="40" height="40" />
      <text x="545" y="56" fill="#171717" fontSize="38" letterSpacing="-1.5">
        coremvp
      </text>
      <image href={screenshotSrc} x="0" y="84" width="1200" height="472.5" />
      <path d="M0 84H1200M0 556.5H1200" stroke="#e5e5e5" />
    </svg>
  );
}
