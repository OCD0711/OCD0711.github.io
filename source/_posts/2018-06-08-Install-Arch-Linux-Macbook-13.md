---
title: Install ArchLinux on MacBook 2016 and later
author: "OCD"
date: 2018-6-8 1
category:
    - Computer
tags:
    - ArchLinux
---

This passage introduces a way to install Arch Linux on MacBook that releases in 2016 and 2017

<!-- more -->

__Caution__: You should be aware that some functions may not work properly. Do it on your own risk!

## 1. Overview
__What works__:

__1. On booting__

- [x] Booting
- [x] Disks
- [x] HiDPI
- [x] Accelerated Video
- [x] Keyboard Backlight
- [x] USB
- [x] Screen Brightness Control
- [x] Sensors
- [x] Bluetooth

__2. Require modules installed__

- [x] Keyboard, touchbar and trackpad

__3. Partly Working__

- [ ] WiFi (Has some improving method)

__4. Not work__

- [ ] Suspend/Resume
- [ ] Audio (two cards show up, and intel driver is loaded, but no sound)

__Notice__: You may refer to [roadrunner's Gist](https://gist.github.com/roadrunner2/1289542a748d9a104e7baec6a92f9cd7) for a more accurate list.

## 2. Preparation

### 2.1 Hardware 
In this installation, you  need a __USB Stick more than 2 GB__, a __Keybord__, A stable internet connection through tethering, and also, USB Hubs.

__Notice__: This guide uses phone USB tethering and you had better not directly connect to WiFi as it is unstable.

### 2.2 Software
1. Download the latest **ArchLinux iso**
2. Burn it to your **USB sticker** - Use the command `dd` to achieve this.
3. **rEFInd Boot Manager** - Used to boot your MacBook to ArchLinux

__Notice__: Refer to `dd` and `rEFInd`'s manual for more information!

## 3. Basic Installation

### 3.1 Booting & Setting up
1. Insert USB Sticker and reboot your MacBook, in the rEFInd menu, select the efi option for booting ArchLinux, and enter the Installation Environment.
2. Connect your keyboard and your phone to MacBook (your phone may need to connect to WiFi in order to not result in high Cellar fee.) 
3. Set up tethering: In your phone, click **Settings** > **Network & Internet** > **Hotspot & tethering** > **USB Tethering** and turn it on.
4. In the computer, type `dhcpcd` to set up the carrier interface and use `ping archlinux.org` to test your connection.

### 3.2 Partitioning
__Warning__: Do it carefully!

1. Use `fdisk -l` to check your partition table.
2. Look for the disk you want to install ArchLinux (`sda` `sdb` ...)
3. If you could see a `EFI Partition` then please ignore the section with the mark `*`
4. Use `fdisk sdX` to dig into your disk. Enter `p` for a table.
5. Partition your Disk. ( \* You should create a partition of about **500M** at the start the partition table)
6. \* Set EFI Partition
   ```bash
   parted sdX
   set 1 boot on
   ```
7. Format
   ```bash
   mkfs.ext4 /dev/sdXy
   mkfs.vfat /dev/sda1*
   ```
8. Mount
   ```bash
   mount /dev/sdXy /mnt
   mkdir -p /mnt/boot
   mount /dev/sda /mnt/boot
   ```

### 3.3 Install
   __Notice__: You may need to edit `/etc/pacman.d/mirrorlist` to choose a mirror
   ```bash
   pacstrap /mnt base base-devel grub efibootmgr wireless_tools vim
   genfstab -U /mnt >> /mnt/etc/fstab
   ```
   
### 3.4 Chroot
Chroot into the system

```bash
arch-chroot /mnt
```

and follow the official [ArchLinux Instruction](https://wiki.archlinux.org/index.php/installation_guide) set up your `hostname` `timezone` etc.
    
#### 3.4.1 Install GRUB ( Loader )
Stay in the chroot mode and use the following command:

```bash
grub-install --efi-directory=/boot
grub-mkconfig -o /boot/grub/grub.cfg
```

## 4. MacBook Specified Configurations
### 4.1 Make Keyboard Work
Install the Driver:

```bash
pacman -S linux-headers
git clone https://github.com/roadrunner2/macbook12-spi-driver.git
pushd macbook12-spi-driver
git checkout touchbar-driver-hid-driver
sudo ln -s `pwd` /usr/src/applespi-0.1
sudo dkms install applespi/0.1
popd
```

Configure mkinitcpio.conf

```bash
sudo nano /etc/mkinitcpio.conf
```
and in the `modules` section add :

```conf
Modules = (applespi intel_lpss_pci spi_pxa2xx_platform appletb)
```
Then use `mkinitcpio -p linux` to load them on next boot.

Change sensitivity:
Save the two following two files to `/etc/udev/hwdb.d/`:

[61-evdev-local.hwdb](https://gist.github.com/roadrunner2/1289542a748d9a104e7baec6a92f9cd7#file-61-evdev-local-hwdb) 
[61-libinput-local.hwdb](https://gist.github.com/roadrunner2/1289542a748d9a104e7baec6a92f9cd7#61-libinput-local.hwdb) 

 __Note__: You can also see them in the appendix.
 
 Reboot and enjoy.
 
### 4.2 WiFi improvements
There are two ways to change the bad WiFi condition and the discussion is [here](https://bugzilla.kernel.org/show_bug.cgi?id=193121).

#### 4.2.1 Edit the driver
As [here](https://bugzilla.kernel.org/show_bug.cgi?id=193121#c25) suggests:
Use hex editor to change the `/lib/firmware/brcm/brcmfmac43602-pcie.bin`
```
/lib/firmware/brcm/brcmfmac43602-pcie.bin
  offset     0 1 2 3 4 5 6 7 8 9 A B C D E F 0123456789ABCDEF    0 1 2 3 4 5 6 7 8 9 A B C D E F 0123456789ABCDEF
0x00000000  80f140b882f1a4b982f1b0b982f1bcb9 ..@.............   80f140b882f1a4b982f1b0b982f1bcb9 ..@.............
0x00000010  82f1cbb982f1dab982f1e9b982f1f8b9 ................   82f1cbb982f1dab982f1e9b982f1f8b9 ................
...
0x0007c820! 30643a66343a33650063636f64653d58 0d:f4:3e.ccode=X   30643a66343a33650063636f64653d30 0d:f4:3e.ccode=0
0x0007c830! 30007265677265763d31350061613267 0.regrev=15.aa2g   00007265677265763d30000061613267 ..regrev=0..aa2g
0x0007c840  3d3700616135673d370061676267303d =7.aa5g=7.agbg0=   3d3700616135673d370061676267303d =7.aa5g=7.agbg0=
0x0007c850  37310061676267313d37310061676267 71.agbg1=71.agbg   37310061676267313d37310061676267 71.agbg1=71.agbg
...
```
**Note**: As I changed the file, I cannot connect to any WiFi networks. More Investigation required.

#### 4.2.2 Change the txpower
This is simple (see [#10](https://bugzilla.kernel.org/show_bug.cgi?id=193121#c28))

```bash
ip link set wlp2s0 up   # if not already up
iwconfig wlp2s0 txpower 10dBm
```

## 5. Appendix
__61-evdev-local.hwdb__

```
# MacBook8,1 (2015), MacBook9,1 (2016), MacBook10,1 (2017)
evdev:name:Apple SPI Touchpad:dmi:*:svnAppleInc.:pnMacBook8,1:*
evdev:name:Apple SPI Touchpad:dmi:*:svnAppleInc.:pnMacBook9,1:*
evdev:name:Apple SPI Touchpad:dmi:*:svnAppleInc.:pnMacBook10,1:*
 EVDEV_ABS_00=::95
 EVDEV_ABS_01=::90
 EVDEV_ABS_35=::95
 EVDEV_ABS_36=::90

# MacBookPro13,* (Late 2016), MacBookPro14,* (Mid 2017)
evdev:name:Apple SPI Touchpad:dmi:*:svnAppleInc.:pnMacBookPro13,1:*
evdev:name:Apple SPI Touchpad:dmi:*:svnAppleInc.:pnMacBookPro13,2:*
evdev:name:Apple SPI Touchpad:dmi:*:svnAppleInc.:pnMacBookPro14,1:*
evdev:name:Apple SPI Touchpad:dmi:*:svnAppleInc.:pnMacBookPro14,2:*
 EVDEV_ABS_00=::96
 EVDEV_ABS_01=::94
 EVDEV_ABS_35=::96
 EVDEV_ABS_36=::94

evdev:name:Apple SPI Touchpad:dmi:*:svnAppleInc.:pnMacBookPro13,3:*
evdev:name:Apple SPI Touchpad:dmi:*:svnAppleInc.:pnMacBookPro14,3:*
 EVDEV_ABS_00=::96
 EVDEV_ABS_01=::95
 EVDEV_ABS_35=::96
 EVDEV_ABS_36=::95
 ```
 
 __61-libinput-local.hwdb__
 
 ```
 libinput:name:*Apple SPI Touchpad*:dmi:*
 LIBINPUT_MODEL_APPLE_TOUCHPAD=1
 LIBINPUT_ATTR_KEYBOARD_INTEGRATION=internal
 LIBINPUT_ATTR_TOUCH_SIZE_RANGE=200:150
 LIBINPUT_ATTR_PALM_SIZE_THRESHOLD=1200
```
## 6. Credits

1. [Roadrunner's gist](https://gist.github.com/roadrunner2/1289542a748d9a104e7baec6a92f9cd7#61-libinput-local.hwdb)
2. [Many awesome people in bugzilla](https://bugzilla.kernel.org/show_bug.cgi?id=193121)


