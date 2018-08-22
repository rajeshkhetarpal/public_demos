import { getConnection } from "typeorm";
import { User } from "../entities/user";

export function getUserRepository() {
    const conn = getConnection();
    return conn.getRepository(User);
}
