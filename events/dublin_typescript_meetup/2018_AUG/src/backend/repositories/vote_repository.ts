import { getConnection } from "typeorm";
import { Vote } from "../entities/vote";

export function getVoteRepository() {
    const conn = getConnection();
    return conn.getRepository(Vote);
}
