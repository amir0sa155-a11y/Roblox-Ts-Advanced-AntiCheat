import { Flamework } from "@flamework/core";
const startTime = os.clock();

Flamework.addPaths("src/server/services");
Flamework.addPaths("src/server/AntiCheat");
Flamework.addPaths("src/server/AntiCheat/Vehicle/AngleCheck");
Flamework.ignite();
const durationMs = (os.clock() - startTime) * 1000;
print(`Server flamework took ${string.format("%.2f", durationMs)}ms to start.`);
