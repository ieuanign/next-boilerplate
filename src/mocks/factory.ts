import {
	manyOf,
	factory as mswFactory,
	nullable,
	primaryKey,
} from "@mswjs/data";
import { faker } from "@faker-js/faker";

faker.seed(123);

export const factory = mswFactory({
	users: {
		id: primaryKey(faker.datatype.uuid),
		firstName: String,
		lastName: String,
		tasks: nullable(manyOf("tasks", { unique: true })),
	},
	tasks: {
		id: primaryKey(faker.datatype.uuid),
		title: String,
	},
});
