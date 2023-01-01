import fs from "fs";
import { faker } from "@faker-js/faker";
import { factory } from "../factory";
import { TableName } from "../type";

const range = (length: number) => Array.from({ length }, (x, i) => i);

const writeFile = (fileName: string, table: any) => {
	fs.writeFileSync(
		__dirname + `/${fileName}.ts`,
		`const ${fileName} = () => ${JSON.stringify(table.getAll(), undefined, 2)}

		export default ${fileName};
		`
	);
};

const files: (keyof typeof TableName)[] = [];

const generateSeedData = (
	tableName: keyof typeof TableName,
	length: number,
	creator: Function
) => {
	files.push(tableName);
	range(length).forEach(() => creator());

	writeFile(tableName, factory[tableName]);
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
	generateSeedData("tasks", 8, () => {
		factory.tasks.create({
			title: faker.lorem.words(3),
		});
	});

	// generate files.ts
	generateSeedFiles();
};

initSeedData();
