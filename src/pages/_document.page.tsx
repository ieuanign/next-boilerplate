import { Html, Head, Main, NextScript } from "next/document";
import type { DocumentProps } from "next/document";
import i18nConfig from "@i18nConfig";

export default function Document(props: DocumentProps) {
	const currentLocale =
		props.__NEXT_DATA__.locale ?? i18nConfig.i18n.defaultLocale;

	return (
		<Html lang={currentLocale}>
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
