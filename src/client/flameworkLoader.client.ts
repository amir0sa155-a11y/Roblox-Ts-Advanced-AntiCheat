import { Flamework } from "@flamework/core";

const startTime = os.clock();

Flamework.addPaths("src/client/controllers");

Flamework.ignite();
const durationMs = (os.clock() - startTime) * 1000;
print(`Client flamework took ${string.format("%.2f", durationMs)}ms to start.`);
