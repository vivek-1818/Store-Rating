"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_pg_1 = require("@prisma/adapter-pg");
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("../generated/prisma/client");
dotenv_1.default.config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is missing");
}
const adapter = new adapter_pg_1.PrismaPg({
    connectionString
});
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
