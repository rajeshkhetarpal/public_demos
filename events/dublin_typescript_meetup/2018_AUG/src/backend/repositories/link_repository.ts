import { getConnection } from "typeorm";
import { Link } from "../entities/link";

export function getLinkRepository() {
    const conn = getConnection();
    return conn.getRepository(Link);
}
