import NextHead from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

interface HeadProps {
	hostname: string;
}

const Head = ({ hostname }: HeadProps) => {
	const router = useRouter();
	const { t } = useTranslation("common");
	const { locales } = router;

	return (
		<NextHead>
			<title>{t("title")}</title>
			<meta
				name="description"
				content="Boilerplate for NextJS"
				key="description"
			/>
			<meta name="author" content="Ieuan Ignatius" key="author" />
			<meta charSet="utf-8" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1"
				key="viewport"
			/>
			<link rel="alternate" href={hostname} hrefLang="x-default" />
			{locales?.map((locale) => (
				<link
					key={locale}
					rel="alternate"
					href={`${hostname}/${locale}`}
					hrefLang={locale}
				/>
			))}

			<link
				rel="apple-touch-icon"
				sizes="57x57"
				href="/static/favicons/apple-icon-57x57.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="60x60"
				href="/static/favicons/apple-icon-60x60.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="72x72"
				href="/static/favicons/apple-icon-72x72.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="76x76"
				href="/static/favicons/apple-icon-76x76.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="114x114"
				href="/static/favicons/apple-icon-114x114.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="120x120"
				href="/static/favicons/apple-icon-120x120.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="144x144"
				href="/static/favicons/apple-icon-144x144.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="152x152"
				href="/static/favicons/apple-icon-152x152.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/static/favicons/apple-icon-180x180.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="192x192"
				href="/static/favicons/android-icon-192x192.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/static/favicons/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="96x96"
				href="/static/favicons/favicon-96x96.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/static/favicons/favicon-16x16.png"
			/>
			<link rel="manifest" href="/static/favicons/manifest.json" />
			<meta name="msapplication-TileColor" content="#ffffff" />
			<meta
				name="msapplication-TileImage"
				content="/static/favicons/ms-icon-144x144.png"
			/>
			<meta name="theme-color" content="#ffffff" />
		</NextHead>
	);
};

export default Head;
