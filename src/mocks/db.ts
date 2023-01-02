import { manyOf, factory, nullable, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

faker.seed(123);

const range = (length: number) => Array.from({ length }, (x, i) => i);

export const db = factory({
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

// seed data
export const seed = () => {
	range(2).forEach(() => {
		const tasks = range(4).map(() => {
			return db.tasks.create({
				title: faker.lorem.words(3),
			});
		});

		db.users.create({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			tasks,
		});
	});
};

seed();
