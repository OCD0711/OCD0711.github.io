---
title: Use Apple Time-Machine on Raspberry Pi with ArchLinux ARM
author: "OCD"
date: 2018-3-29 1
category:
    - Computer
    - Raspberry Pi
tags:
    - MacOS
    - Time Machine
---

作为下次设置的备份.

<!-- more -->
## 1. 要求
1. A Raspberry 
2. A hard drive 
3. A stable internet connection

## 2. Installation
 使用 `yaourt` 进行环境设置
 
### 2.1 Pre-install
```bash
 # Install required Packages
 yaourt -Syu
 yaourt -S avahi nss-mdns netatalk hfsplus
```
__Note:__ 
In the process you may encounter architecture errors like 
```text
==> ERROR: xxx is not available for the 'aarch64' architecture.
```
then just edit the PKGBUILD and set the `arch` = `'any'` to silent the warning

### 2.2 Set up device and folder
#### 2.2.1. We should set up the device (hard drive)

```bash
# Check if the device is connected 
sudo blkid
```

Here is the output of my Pi:

```
➜ sudo blkid
/dev/mmcblk0p1: SEC_TYPE="msdos" UUID="120A-474C" TYPE="vfat" PARTUUID="31203949-01"
/dev/mmcblk0p2: UUID="66ffe290-de04-4547-b091-82fc1854bd20" TYPE="ext4" PARTUUID="31203949-02"
/dev/sda1: LABEL="EFI" UUID="67E3-17ED" TYPE="vfat" PARTLABEL="EFI System Partition" PARTUUID="1e03d7c8-468b-40f0-a9f8-dcade8ea43e7"
/dev/sda2: LABEL="SeagateExpansionMedia" UUID="18E4C435E4C41742" TYPE="ntfs" PARTUUID="f47076b7-b738-4136-aba3-7ce886844070"
/dev/sda3: UUID="d4394cd9-7e11-38db-95a9-7d781e0cbde0" LABEL="MacOnDisk" TYPE="hfsplus" PARTUUID="4c697e1f-5b89-4c97-8bf3-11c819cb117e"
/dev/sda4: UUID="74f09d9f-73b2-30d5-9f89-b9ac88490538" LABEL="Recovery HD" TYPE="hfsplus" PARTUUID="9a17bdc7-3761-458f-b000-4a00debeb31b"
/dev/sda5: UUID="3a161221-c554-3e56-ac93-b30c37087812" LABEL="Time-Machine" TYPE="hfsplus" PARTUUID="2c0ebe1f-1af8-4928-98a3-ce615891e9f0"
/dev/mmcblk0: PTUUID="31203949" PTTYPE="dos"
```

As you can see here, and I want to backup my Mac to `/dev/sda5` which labelled as `Time-Machine`

#### 2.2.2. Add a user to the machine
So that we can separate the account with others

```bash
sudo useradd timemachine
sudo passed timemachine
# Then add the password you like for the user timechine
```
#### 2.2.3. Set up a folder

```bash
# Folder in /media/Time-Machine
sudo mkdir -p /media/Time-Machine

# Give it permission
sudo chown -R timemachine:users /media/Time-Machine
```
#### 2.2.4 Set fstab
So that we can mount it automatically to the folder

```bash
sudo nano /etc/fstab
```

and add: 
```fstab
/dev/sda5 /media/Time-Machine hfsplus force,rw,user,auto 0 0
```

and use:
```bash
sudo mount
```
to mount the desired folder.

### 2.3 Configuration
#### 2.3.1 configure `afp.conf`

```bash
sudo nano /etc/afp.conf
``` 
and input the following lines:

```conf
[global]
UAM list = uams_guest.so, uams_dhx.so, uams_dhx2.so,

[Time Machine]
path = /media/Time-Machine
time machine = yes
```
#### 2.3.2 configure Service

```bash
sudo nano /etc/avahi/services/afpd.service
```
 and paste these lines:
 
 ```xml
<?xml version="1.0" standalone='no'?><!--*-nxml-*-->
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
    <name replace-wildcards="yes">%h</name>
    <service>
        <type>_afpovertcp._tcp</type>
        <port>548</port>
    </service>
    <service>
        <type>_device-info._tcp</type>
        <port>0</port>
        <txt-record>model=TimeCapsule</txt-record>
    </service>
</service-group>
 ```

## 3. Start
Now we can start the service
```bash
sudo systemctl enable netatalk.service
sudo systemctl start netatalk.service
sudo systemctl start avahi-daemon.service
```

## Done!
Just Open your Time Machine Preferences and back your things up

__Note:__
the `username` is `timemachine` 
the `password` is the password you entered before

## Credits
1. [https://github.com/mr-bt/raspberrypi-timemachine]()
2. [https://www.pihomeserver.fr/en/2013/01/16/raspberry-pi-home-server-arch-linux-sauvegarder-son-mac-avec-time-machine/]()

