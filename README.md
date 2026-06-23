<div align="center">

<img src="https://img.shields.io/badge/TypeScript-RobloxTS-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Framework-Flamework-FF6B35?style=for-the-badge" alt="Flamework" />
<img src="https://img.shields.io/badge/Status-Production%20Ready-2ECC71?style=for-the-badge" alt="Status" />

<br />
<br />

# 🛡️ Advanced AntiCheat

### *A highly optimized, reliable, and advanced AntiCheat system.*

<br />

</div>

---

<p align="center">
Developed with <b>roblox-ts</b> and <b>Flamework</b>.<br/>
Designed to be <b>reliable</b>, highly effective against exploits, and thoroughly tested in production to guarantee <b>zero false positives</b>.
</p>

---

<br />



## 🔍 Main Detections

<br />

<div align="center">

#  CoreGui Detect

</div>

> [!IMPORTANT]
> Exploiters usually hide their scripts menus inside the `CoreGui` because Roblox strictly blocks developers from accessing it. Despite this, this AntiCheat uses a **unique method** to detect any scripts hiding in the CoreGui.

<br />

<div align="center">

https://github.com/user-attachments/assets/905eb330-e718-42a1-88c5-c55a146ea659

https://github.com/user-attachments/assets/af9fb2fb-0715-44ba-b594-ea198a77b50a

https://github.com/user-attachments/assets/27e72e2b-39cd-42d2-9077-bc101763d7dd

https://github.com/user-attachments/assets/ca4f274d-47b9-4813-974c-18665074c715

</div>

<br />

<div align="center">

###  This feature alone is enough to stop 80% of exploits in the game. 

</div>

<br />

---

<br />

### Xeno Inject
> Instantly detects injections from Xeno, which is currently one of the most widely used free exploits among PC and laptop players.


https://github.com/user-attachments/assets/8c4bd024-6182-46db-8d75-91ab65557e6d


<br />

### High Memory Scripts
> Catches any scripts that consume abnormally high memory.

<br />

---

<br />

> [!NOTE]
> This project includes many more detections that are not listed here. You can explore the full codebase directly inside the `src` directory.

---

<br />

<br />

## ⚙️ How It Works

Once abnormal activity is detected, the system takes immediate action:

| Stage | Action |
|---|---|
|  **Client-Side** | Sends a RemoteEvent with an ID like `2ff`, which means a NoClip attempt. |
|  **Server-Side** | Simply calls `BanService` with 2 arguments: the offending player and the ID. |
|  **Ban Service** | `src/server/services/BanService.ts` reads the attached arguments and executes the specific punishment for the passed ID. |

---

<br />

## 🌟 Features

<br />

### 🛡️ Dynamic Remote Obfuscation

Automatically changes the name of the AntiCheat RemoteEvent every time a new server starts. This prevents exploiters from identifying it, adding an essential layer of protection.

<div align="center">

https://github.com/user-attachments/assets/84417db7-1dbe-4027-a950-1639c04d417d

</div>

<br />

---

<br />

### 🔄 Dynamic Script Protection

Scripts tagged with `AntiCheat` continuously change their names and locations. This keeps them hidden, making it impossible for exploiters to track them. This provides an extra layer of protection, since many exploits require a fixed target to locate and disable the anticheat.

<div align="center">

https://github.com/user-attachments/assets/615dc8a1-181c-4b55-bfe2-6c5146522151

</div>

<br />

---

<br />

### 🔐 Encrypted Client Logic

All client-sided scripts are fully obfuscated. Of course, this will not stop hackers completely. Many exploiters use tools to scan your scripts for specific words. Obfuscation hides these words, making it much harder for them to locate anticheat scripts.

<div align="center">

</div>

<br />

---

<br />

### 🛠️ Fully Customizable BanService

The system features a well-organized and fully customizable `BanService`. For example, you can set a delay before applying a ban. This prevents exploiters from knowing exactly what caused their scripts to be detected.

<div align="center">

<img width="1227" height="333" alt="Screenshot 2026-06-21 011218" src="https://github.com/user-attachments/assets/e544e402-c461-4d41-bc60-2c9b7866473b" />

</div>

---

<br />

> [!WARNING]
> This repository is only for showcase purposes. Please do not use or copy any part of this project without my permission.

<div align="center">

</div>
