import "reflect-metadata";
import app from "./app";
import { port } from "./config";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
	.then(async () => {
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((error) => console.log(error));
