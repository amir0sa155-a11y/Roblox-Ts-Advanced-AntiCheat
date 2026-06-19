import { Service, OnStart } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";
import { BanService } from "../../services/BanService";

@Service()
export class VehicleSpeedService implements OnStart {
	private readonly maxSpeed = 350;
	private readonly maxAcceleration = 80;

	private readonly vehicleConnections = new Map<Instance, RBXScriptConnection>();
	private readonly lastSpeeds = new Map<Instance, number>();

	constructor(private readonly banService: BanService) {}

	public onStart() {
		const vehiclesFolder = Workspace.FindFirstChild("Vehicles") as Folder | undefined;
		if (!vehiclesFolder) return;

		const monitorVehicle = (vehicle: Instance) => {
			const player = Players.FindFirstChild(vehicle.Name) as Player | undefined;
			if (!player) return;

			const driveSeat = vehicle.FindFirstChild("DriveSeat") as VehicleSeat | undefined;
			if (!driveSeat) return;

			this.lastSpeeds.set(vehicle, 0);

			const connection = RunService.Heartbeat.Connect(() => {
				if (!vehicle.Parent || !driveSeat.Parent) {
					connection.Disconnect();
					this.vehicleConnections.delete(vehicle);
					this.lastSpeeds.delete(vehicle);
					return;
				}

				const currentSpeed = driveSeat.AssemblyLinearVelocity.Magnitude;

				if (!driveSeat.Occupant) {
					this.lastSpeeds.set(vehicle, currentSpeed);
					return;
				}

				const lastSpeed = this.lastSpeeds.get(vehicle) ?? 0;
				const speedGained = currentSpeed - lastSpeed;

				if (currentSpeed > this.maxSpeed) {
					if (lastSpeed < 200 || speedGained > this.maxAcceleration) {
						connection.Disconnect();
						this.vehicleConnections.delete(vehicle);
						this.lastSpeeds.delete(vehicle);

						this.banService.ban(player, "d1g");
						return;
					}
				}

				this.lastSpeeds.set(vehicle, currentSpeed);
			});

			this.vehicleConnections.set(vehicle, connection);
		};

		vehiclesFolder.ChildAdded.Connect(monitorVehicle);

		for (const vehicle of vehiclesFolder.GetChildren()) {
			monitorVehicle(vehicle);
		}

		vehiclesFolder.ChildRemoved.Connect((vehicle) => {
			const connection = this.vehicleConnections.get(vehicle);

			if (connection) {
				connection.Disconnect();
			}

			this.vehicleConnections.delete(vehicle);
			this.lastSpeeds.delete(vehicle);
		});
	}
}
