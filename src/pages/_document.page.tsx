import { DEFAULT_LANG } from "@core/const";
import { Html, Head, Main, NextScript } from "next/document";
import type { DocumentProps } from "next/document";

export default function Document(props: DocumentProps) {
	const currentLocale = props.__NEXT_DATA__.locale ?? DEFAULT_LANG;

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
