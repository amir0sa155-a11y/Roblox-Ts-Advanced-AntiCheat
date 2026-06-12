import { Players, RunService, Workspace } from "@rbxts/services";
import { BanService } from "../services/BanService";

const maxSpeed = 350;
const maxAcceleration = 80;

const vehicleConnections = new Map<Instance, RBXScriptConnection>();
const lastSpeeds = new Map<Instance, number>();

const vehiclesFolder = Workspace.FindFirstChild("Vehicles");

if (vehiclesFolder) {
    const monitorVehicle = (vehicle: Instance) => {
        const player = Players.FindFirstChild(vehicle.Name) as Player | undefined;
        if (!player) return;

        const driveSeat = vehicle.FindFirstChild("DriveSeat") as VehicleSeat | undefined;
        if (!driveSeat) return;

        lastSpeeds.set(vehicle, 0);

        const connection = RunService.Heartbeat.Connect(() => {
            if (!vehicle.Parent || !driveSeat.Parent) {
                connection.Disconnect();
                vehicleConnections.delete(vehicle);
                lastSpeeds.delete(vehicle);
                return;
            }

            const currentSpeed = driveSeat.AssemblyLinearVelocity.Magnitude;

            if (!driveSeat.Occupant) {
                lastSpeeds.set(vehicle, currentSpeed);
                return;
            }

            const lastSpeed = lastSpeeds.get(vehicle) ?? 0;
            const speedGain = currentSpeed - lastSpeed;

            if (currentSpeed > maxSpeed) {
                if (lastSpeed < 200 || speedGain > maxAcceleration) {
                    connection.Disconnect();
                    vehicleConnections.delete(vehicle);
                    lastSpeeds.delete(vehicle);
                    BanService.instance.executeBan(player, "d1g");
                    return;
                }
            }

            lastSpeeds.set(vehicle, currentSpeed);
        });

        vehicleConnections.set(vehicle, connection);
    };

    vehiclesFolder.ChildAdded.Connect(monitorVehicle);

    for (const vehicle of vehiclesFolder.GetChildren()) {
        monitorVehicle(vehicle);
    }

    vehiclesFolder.ChildRemoved.Connect((vehicle) => {
        const connection = vehicleConnections.get(vehicle);
        if (connection) {
            connection.Disconnect();
        }
        vehicleConnections.delete(vehicle);
        lastSpeeds.delete(vehicle);
    });
}