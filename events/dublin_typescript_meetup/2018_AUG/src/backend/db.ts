import { User } from "./entities/user";
import { Link } from "./entities/link";
import { Vote } from "./entities/vote";
import { createConnection } from "typeorm";

export async function connecToDatabase() {

    const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
    const DATABASE_USER = process.env.DATABASE_USER || "";
    const DATABASE_PORT = 5432;
    const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "";
    const DATABASE_DB = "demo";

    const entities = [
        User,
        Link,
        Vote
    ];

    const conn = await createConnection({
        type: "postgres",
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_DB,
        entities: entities,
        synchronize: true
    });

}
