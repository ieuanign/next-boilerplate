import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DEFAULT_LANG } from "./const";

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
	locale = DEFAULT_LANG,
	files = ["common"]
) => {
	return await serverSideTranslations(locale, files);
};
