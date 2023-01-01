import fs from "fs";
import { faker } from "@faker-js/faker";
import { factory } from "../factory";
import { TableName } from "../type";

const range = (length: number) => Array.from({ length }, (x, i) => i);

const writeFile = (tableName: keyof typeof TableName) => {
	fs.writeFileSync(
		__dirname + `/${tableName}.ts`,
		`const ${tableName} = ${JSON.stringify(
			factory[tableName].getAll(),
			undefined,
			2
		)}

		export default ${tableName};
		`
	);
};

const files: (keyof typeof TableName)[] = [];

const generateSeedData = (
	tableName: keyof typeof TableName,
	length: number,
	getData: (rangeIndex: number) => Record<string, any>
) => {
	files.push(tableName);
	range(length).forEach((_, index) =>
		factory[tableName].create(getData(index))
	);

	writeFile(tableName);
};

const generateSeedFiles = () => {
	const imports = [];
	for (const file of files) {
		imports.push(`import ${file} from "./${file}"`);
	}

	fs.writeFileSync(
		__dirname + `/files.ts`,
		`${imports.join("\n")}

		const files = {${files.join(", ")}}

		export default files
		`
	);
};

const initSeedData = () => {
	// generate {TableName}.ts here
	generateSeedData(TableName.tasks, 8, () => ({
		title: faker.lorem.words(3),
	}));

	const taskList = factory[TableName.tasks].getAll();

	generateSeedData(TableName.users, 2, (userIndex: number) => ({
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		tasks: taskList.filter((_, taskIndex) =>
			userIndex === 0 ? taskIndex % 2 === 0 : taskIndex % 2 !== 0
		),
	}));

	// generate files.ts
	generateSeedFiles();
};

initSeedData();
