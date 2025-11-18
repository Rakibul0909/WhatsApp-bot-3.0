# npm-install
---
- create a folder mybot
- create a file index.js

## Folder Structure
```bash
mybot/
│
├── index.js
├── package.json             <-- Automatic
├── package-lock.json        <-- Automatic
├── node_modules/            <--  Automatic
│
├── auth/                    <-- Auto-created
│   ├── creds.json
│   └── other auth files
│
├── replies/                 <-- YOU must create this
│   ├── whatsapp.txt
│   ├── facebook.txt
│   ├── instagram.txt
│   ├── kali_linux_install.txt
│   └── location_tracking.txt
│
└── README.md
```
---
| packages      | version  |
|---------------|---------|
| node -v | v24.11.1 ✅ |
| npm -v  | v11.6.2 ✅ |
---
## create a folder (mybot)
```bash
mkdir mybot
```
## go to the folder 
```bash
cd mybot
```
## create a file (index.js)
```bash
nano index.js
```
## package.json file create command
```bash
npm init -y
```
### output
```bash
┌──(kali㉿localhost)-[~/mybot]
└─$ npm init -y
Wrote to /home/kali/mybot/package.json:

{
  "name": "mybot",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@whiskeysockets/baileys": "^6.7.21"
  },
  "devDependencies": {},
  "type": "commonjs"
}
```
## package-lock.json file create command
```bash
npm install
```
### output
```bash
┌──(kali㉿localhost)-[~/mybot]
└─$ npm install

up to date, audited 1 package in 834ms

found 0 vulnerabilities
```
## create node_modules file coomnd
```bash
sudo apt install -y curl && curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash - && sudo apt install -y nodejs
```
```bash
ls
```
### output
```bash
┌──(kali㉿localhost)-[~/mybot]
└─$ ls
auth      node_modules
package.json   index.js  package-lock.json
```
## baileys install
```bash
npm install @whiskeysockets/baileys 
```
### output
```bash
┌──(kali㉿localhost)-[~/mybot]
└─$ npm install @whiskeysockets/baileys

added 93 packages, and audited 94 packages in 50s                                                                     19 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```
