import "dotenv/config";

export const port = process.env.PORT || 5001;
export const dev_db_name = process.env.DEV_DB_NAME;
export const dev_db_user = process.env.DEV_DB_USERNAME;
export const dev_db_pass = process.env.DEV_DB_PASSWORD;

export const test_db_name = process.env.TEST_DB_NAME;
export const test_db_user = process.env.TEST_DB_USERNAME;
export const test_db_pass = process.env.TEST_DB_PASSWORD;

export const db_host = process.env.DB_HOST;

export const cors_origin = process.env.CORS_ORIGIN;
