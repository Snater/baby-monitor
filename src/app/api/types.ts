import {RowDataPacket} from "mysql2";
import {Event} from "@/types";

export type DbEvent = Event & RowDataPacket;
