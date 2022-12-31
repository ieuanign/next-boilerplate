import fs from "fs";
import { faker } from "@faker-js/faker";
import { factory } from "../factory";

const range = (length: number) => Array.from({ length }, (x, i) => i);

const writeFile = (fileName: string, table: any) => {
	fs.writeFileSync(
		__dirname + `/${fileName}.ts`,
		`const ${fileName} = () => ${JSON.stringify(table.getAll(), undefined, 2)}

		export default ${fileName};
		`
	);
};

const initSeedData = () => {
	range(5).forEach(() =>
		factory.tasks.create({
			title: faker.lorem.words(3),
		})
	);

	writeFile("tasks", factory.tasks);
};

initSeedData();
