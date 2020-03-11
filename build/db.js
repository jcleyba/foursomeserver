"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var postgres = require("postgres");
exports.default = postgres({
    host: "127.0.0.1",
    port: 5432,
    database: "juancruzleyba",
    username: "postgres",
    password: "postgres",
    ssl: false,
    max: 10,
    timeout: 0 // Idle connection timeout in seconds
}); // will default to the same as psql
