import { factory as mswFactory, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

faker.seed(123);

export const factory = mswFactory({
	tasks: {
		id: primaryKey(faker.datatype.uuid),
		title: String,
	},
});
