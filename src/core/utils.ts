import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import i18nConfig from "@i18nConfig";

export const utility = () => {
	console.log("utility module");
};

/**
 *
 * @param locale a string from next-i18next.config.js
 * @param files an array of json files in public/locales/{lang}
 * @returns
 */
export const ssrLangProps = async (
	locale = i18nConfig.i18n.defaultLocale,
	files = ["common"]
) => {
	return await serverSideTranslations(locale, files);
};
