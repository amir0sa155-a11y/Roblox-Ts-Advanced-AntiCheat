import { Service, OnStart } from "@flamework/core";
import { Players, ServerStorage, Workspace } from "@rbxts/services";

@Service()
export class VehicleSpawnService implements OnStart {
	public onStart() {
		const carsFolder = ServerStorage.FindFirstChild("Car");
		const vehiclesFolder = Workspace.FindFirstChild("Vehicles");

		if (!carsFolder || !vehiclesFolder) return;

		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect(() => {
				const character = player.Character;
				if (!character) return;

				const carClone = carsFolder.Clone() as Model;
				carClone.Name = player.Name;
				carClone.Parent = vehiclesFolder;

				const humanoidRootPart = character.FindFirstChild("HumanoidRootPart") as BasePart;

				if (humanoidRootPart) {
					carClone.PivotTo(humanoidRootPart.CFrame.add(new Vector3(0, 5, 0)));
				}
			});
		});

		Players.PlayerRemoving.Connect((player) => {
			const playerCar = vehiclesFolder.FindFirstChild(player.Name);

			if (playerCar) {
				playerCar.Destroy();
			}
		});
	}
}
