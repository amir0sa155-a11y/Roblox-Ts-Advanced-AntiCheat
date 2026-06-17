import { Controller, OnStart } from "@flamework/core";
import { Players, CollectionService, HttpService } from "@rbxts/services";
import { CoreSecurityController } from "./Core";

@Controller()
export class ObfuscationController implements OnStart {
	constructor(private security: CoreSecurityController) {}

	public onStart() {
		this.security.waitForReady();
		task.wait(1);
		const StarterPlayerScripts = Players.LocalPlayer.WaitForChild("PlayerScripts") as Folder;
		const randomFolders: Folder[] = [];
		const antiCheatScripts: Instance[] = [];
		const containers: Instance[] = [StarterPlayerScripts];

		for (const obj of StarterPlayerScripts.GetDescendants()) {
			if (obj.IsA("Folder")) containers.push(obj);
		}

		for (let i = 0; i < 10; i++) {
			const folder = new Instance("Folder");
			folder.Name = HttpService.GenerateGUID(false);
			folder.Parent = containers[math.random(0, containers.size() - 1)];

			randomFolders.push(folder);
			containers.push(folder);

			folder.AncestryChanged.Connect((_, parent) => {
				if (!parent) this.security.fireBan("lb1");
			});
		}

		const antiCheatFolder = new Instance("Folder");
		antiCheatFolder.Name = HttpService.GenerateGUID(false);
		antiCheatFolder.Parent = randomFolders[math.random(0, randomFolders.size() - 1)];

		antiCheatFolder.AncestryChanged.Connect((_, parent) => {
			if (!parent) this.security.fireBan("lb1");
		});

		for (const instance of CollectionService.GetTagged("AntiCheat")) {
			antiCheatScripts.push(instance);
			pcall(() => {
				instance.Name = HttpService.GenerateGUID(false);
				instance.Parent = antiCheatFolder;
			});
		}

		task.spawn(() => {
			while (true) {
				task.wait(1);
				for (const scriptObject of antiCheatScripts) {
					if (scriptObject.Parent) scriptObject.Name = HttpService.GenerateGUID(false);
				}
			}
		});

		task.spawn(() => {
			while (true) {
				task.wait(1);
				for (const folder of randomFolders) {
					if (folder.Parent) folder.Name = HttpService.GenerateGUID(false);
				}
				if (antiCheatFolder.Parent) antiCheatFolder.Name = HttpService.GenerateGUID(false);
			}
		});

		task.spawn(() => {
			while (true) {
				task.wait(0.1);
				if (randomFolders.size() > 0) {
					const targetFolder = randomFolders[math.random(0, randomFolders.size() - 1)];
					if (targetFolder.Parent) antiCheatFolder.Parent = targetFolder;
				}
			}
		});
	}
}
