---
title: raspi 上 4G 模块使用研究过程
author: "OCD"
date: 2019-01-14 11:51:15
category:
    - Raspi
tags:
    - raspi
    - Serial Communications
    - 4G model
---

## 目的:
实现在树莓派嵌入式系统上开发 4g 模块, 支持 4g 上网短信等移动网络功能

## 目前测试的仅 龙尚U9300C 龙尚U8300C 华为ME909s-821 其他理论相同, 华为有另外解决方案可以不参考我的帖子

## 硬件材料:
1. 树莓派 3b+
2. 4g 模块: U9300C/U8300C/ME909s-821 等
3. PCIE 转 USB 开发板
4. 外置天线

## 开发准备:
为了防止接下来的内核编译开发, 影响某些软件更新不全导致功能失效, 所以提前更新

更新树莓派内核的方法:
1. sudo apt-get update //获取最近的软件包列表, 包的信息有这些包是否更新过
2. sudo apt-get dist-upgrade //如果这个包没有发布更新, 就不管它, 有则更新

apt-get upgrade 和 apt-get dist-upgrade 的区别:

upgrade 只是简单的更新包, 不管依赖, 不添加包或删除包

而 dist-upgrade 可以根据依赖关系的变化添加包删除包


## 树莓派内核编译环境:
有两种方式: 
1. 一种是直接在树莓派上编译
2. 一种是采用自己搭建的交叉编译环境

推荐第二种方式, 原因如下:
1. 做嵌入式开发的需要, 希望能熟悉整个流程
2. 树莓派上编译非常缓慢, 而且发热严重(ps: 虽然本身就热)
3. 使用自己的交叉编译环境, 移植和离线发布都非常方便
4. 如果你使用 macos 以上当我都没说

### 第二种方式(交叉编译)

[参考树莓派官方内核编译说明](https://www.raspberrypi.org/documentation/linux/kernel/building.md “点击跳转”)

1. 编译前准备

    首先安装git和依赖:

    `sudo apt-get install git bc bison flex libssl-dev libncurses-dev`

    然后获取源码, 需要一点时间:

    `git clone --depth=1 https://github.com/raspberrypi/linux`

2. BSP开发

    >交叉编译系统:  Linux kali 4.19.29-Re4son-v8+ #6 SMP PREEMPT Wed Mar 27 00:15:50 UTC 2019 aarch64 GNU/Linux
    >
    >交叉编译器: gcc-linaro-arm-linux-gnueabihf-raspbian
    >
    >交叉编译版本: gcc version 7.2.1 20171011 (Linaro GCC 7.2-2017.11)

    kali [下载地址](https://www.kali.org/downloads “点击跳转”)

    交叉编译工具链 [下载地址](https://github.com/raspberrypi/tools “点击跳转”)

    1) 处理编译环境:

        下载工具链:
            
        `git clone https://github.com/raspberrypi/tools ~/tools`

        添加工具链到全局变量:

        32位: 
        ``` bash
        echo PATH=\$PATH:~/tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian/bin >> ~/.bashrc

        source ~/.bashrc
        ```

        64位: 
        ``` bash
        echo PATH=\$PATH:~/tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin >> ~/.bashrc
        
        source ~/.bashrc
        ```

    2) 添加系统组建

        ``` bash
        cd kernel

        KERNEL=kernel8 (需要在树莓派机器上查看uname -a 看下arm版本)

        make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf-  bcm2709_defconfig (32位)

        make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- bcmrpi3_defconfig (64位)
        ```

        选中如下组建:
        
        device drivers ---> usb support ---> usb serial converter support 
        
        中选中 USB driver for GSM and CDMA modems

    ![](https://github.com/OCD0711/MyPostImages/raw/master/WX20190628-110326.png)


        添加PPP协议支持:

        Device Drivers ---> Network device support

    ![](https://github.com/OCD0711/MyPostImages/raw/master/WX20190628-110911@2x.png)


        添加驱动:

        找到内核源码文件c(一般情况下，路径在..\drivers\usb\serial\option.c)

        在源码中查找 option_ids 表，请参照上面1 节中项目信息添加 龙尚产品的 VID 0x1c9e和 PID0x9b3c

        说明:

        在比较早的 linux 版本中，路径在..\drivers\usb\serial\usb-serial.c

    ![](https://github.com/OCD0711/MyPostImages/raw/master/WX20190628-111306@2x.png)

    ![](https://github.com/OCD0711/MyPostImages/raw/master/WX20190628-111445@2x.png)

    ![](https://github.com/OCD0711/MyPostImages/raw/master/WX20190628-111435@2x.png)

    3) 内核编译

        因为是首次编译，所以并没有要清除的文件，但原来编译过内核就最好还是清理一下

        一般在源码编译的时候都使用make clean，但会保留内核的配置文件.

        内核配置:

        ``` bash
        KERNEL=kernel8 (需要在树莓派机器上查看uname -a 看下arm版本)
        
        make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf-  bcm2709_defconfig (32位)

        make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- bcmrpi3_defconfig (64位)
        ```

        编译zImage，modules和dtbs:

        zImage算是最终内核镜像的半成品，modules是内核模块，

        dtbs作用于/boot，个人觉得应该与树莓派加电启动有关，类似BIOS
    
        Note:多处理系统可以添加选项-j n ,n为数字,表示多处理器的数量*1.5。加快编译速度

        32位
        `make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- zImage modules dtbs -jTHREADNUM`

        64位
        `make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- Image modules dtbs -jTHREADNUM`


    4) 打包内核:

        内核编译完成后，最后一步包括复制 Linux 内核以及设备树到启动分区中：

        ```
        cp arch/arm64/boot/Image /mnt/boot/kernel8.img
        cp arch/arm64/boot/dts/broadcom/bcm2710-rpi-3-b.dtb /mnt/boot/
        ```

        调整 config.txt :

        ```
        echo “kernel=kernel8.img” >> /mnt/boot/config.txt
        ```

        安装内核模块:

        ```
        make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu INSTALL_MOD_PATH=/mnt modules_install
        umount /mnt/boot
        umount /mnt
        ```


## 好了这就结束了这篇咕咕咕几个月的教程了...