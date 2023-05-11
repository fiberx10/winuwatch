import { useRouter } from "next/router";

export default function Test() {
  const { locales } = useRouter();

  return (
    <div>
      {locales?.map((locale) => (
        <div key={locale}>
          <a href={`/${locale}`}>{locale}</a>
        </div>
      ))}
    </div>
  );
}
