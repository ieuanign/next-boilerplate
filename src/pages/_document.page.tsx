import { Html, Head, Main, NextScript, DocumentProps } from "next/document";

import { DEFAULT_LANG } from "@core/const";

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
