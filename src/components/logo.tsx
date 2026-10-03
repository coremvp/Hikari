import Image from 'next/image';

export function Logo() {
  return (
    <>
      <Image
        src="/icon.svg"
        alt=""
        width={24}
        height={24}
        className="shrink-0"
      />
      <span>
        Hikari{' '}
        <span className="text-xs font-normal text-neutral-500">by CoreMVP</span>
      </span>
    </>
  );
}
