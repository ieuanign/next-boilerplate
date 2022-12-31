import { factory } from "./factory";
import tasks from "./seeds/tasks";

const seedFiles = {
	tasks,
};

const migrate = (db: any) => {
	Object.entries(seedFiles).forEach(([key, value]) => {
		value().forEach(db[key].create);
	});

	return db;
};

export const db = migrate(factory);
