import "reflect-metadata";
import { DataSource } from "typeorm";
import {
	db_host,
	dev_db_name,
	dev_db_pass,
	dev_db_user,
	test_db_name,
	test_db_pass,
	test_db_user,
} from "./config";
import { Egyptian } from "./entities/Egyptian";
import { NonEgyptian } from "./entities/NonEgyptian";
import { Station } from "./entities/Station";
import { Trip } from "./entities/Trip";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: db_host,
	port: 5432,
	username: dev_db_user,
	password: dev_db_pass,
	database: dev_db_name,
	synchronize: true,
	logging: true,
	entities: [User, Egyptian, NonEgyptian, Trip, Station],
	subscribers: [],
	migrations: [],
});

export const TestDataSource = new DataSource({
	type: "postgres",
	host: db_host,
	port: 5432,
	username: test_db_user,
	password: test_db_pass,
	database: test_db_name,
	synchronize: true,
	logging: false,
	entities: [User, Egyptian],
});
