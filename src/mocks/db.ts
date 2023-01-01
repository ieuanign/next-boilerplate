import { factory } from "./factory";
import seedFiles from "./seeds/files";

const migrate = (db: any) => {
	Object.entries(seedFiles).forEach(([key, value]) => {
		value.forEach(db[key].create);
	});

	return db;
};

export const db = migrate(factory);
