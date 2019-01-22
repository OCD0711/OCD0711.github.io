---
title: 解决mac下menuconfig报错的问题
author: "OCD"
date: 2019-01-22 10:38:05
category:
    - Mac
tags:
    - linux
    - raspi
    - kernel
---

## 序

最近无聊开坑....好吧是公司项目...玩着玩着想在自己电脑上跑...结果 osx 下 menuconfig 出这个问题, 看下图....没办法解决掉坑来写个 blog 记录

![](https://ws1.sinaimg.cn/large/006tNc79gy1fzf5woibvvj30u015w7q5.jpg)

__错误:__
> ld: symbol(s) not found for architecture x86_64
> clang: error: linker command failed with exit code 1 (use -v to see invocation)

__目的:__
使用 mconf, 自定义一个 make menuconfig 界面


## 分析

1. 在 macOS 下使用 make menuconfig 调用图形界面做 config 时, 可能会出现如下错误(小声逼逼 ----> 坑逼必现):

> ld: symbol(s) not found for architecture x86_64
> clang: error: linker command failed with exit code 1 (use -v to see invocation)

一般的, 编译 busybox 或者 boot 或者 linux 内核之前, 还是使用图形化界面来做配置最为直观. 实现这一目的自然是执行 make menuconfig.

make menuconfig 实际上就是拿 <font color=#FF0000>mconf</font> 这个工具去解析 config 文件里的描述信息, 进而转换为图形界面(继续小声逼逼...就是按规律列出来加了个背景色), config 文件有自动定义的语法格式.

第一次执行 make menuconfig 时, 需要先生成 mconf 这个工具, 在预编译 scripts/kconfig/mconf.c 生成 scripts/kconfig/mconf.o 之后的连接阶段, 需要 ldconfig 参数给出所需要连接的库的位置, 所说的库 k为后缀为 .a 或 .so 或 .dylib 的 __ncursesw ncurses curses__ 库中, 生成 ldflags 的脚本为: scripts/kconfig/lxdialog/check-lxdialog.sh

上面报错的原因就是, macOS 下 __ncursesw ncurses curses__ 这些库文件的位置不能通过 check-lxdialog.sh 里给出命令来找到, 所以生成的 ldflags 不对, 进而无法生成 mconf


## 解决办法

### 一. 方法一

打开 scripts/kconfig/lxdialog/check-lxdialog.sh 文件.

将下面这段添加进去(小声逼逼..markdown 不能给代码段内的添加颜色凑合着看吧):
``` sh
		for lib in ncursesw ncurses curses ; do
			if [ -f /usr/lib/lib${lib}.${ext} ]; then
				echo "-l${lib}"
				exit
			fi
		done
```

添加位置参考:
``` sh
ldflags()
{
	pkg-config --libs ncursesw 2>/dev/null && exit
	pkg-config --libs ncurses 2>/dev/null && exit
	for ext in so a dll.a dylib ; do
		for lib in ncursesw ncurses curses ; do
			$cc -print-file-name=lib${lib}.${ext} | grep -q /
			if [ $? -eq 0 ]; then
				echo "-l${lib}"
				exit
			fi
		done
		for lib in ncursesw ncurses curses ; do
			if [ -f /usr/lib/lib${lib}.${ext} ]; then
				echo "-l${lib}"
				exit
			fi
		done
	done
	exit 1
}
```

之后回到目录下 make menuconfig


### 二. 方法二 (小声逼逼建议不要看...用方案一..)

在生成 mconf 之后, 我们可以按特定的语法写出 config 文件, 进而自定义 make menuconfig 界面:

下面是我的 config 文件, 语法是简单且通用的, 可以仿照自定义出自己的界面:

``` conf
mainmenu "OCD Configuration"

config CONFIG_NAME
	string "System Name String"
	default "Handawei config-demo"
	help 
        just write you config-name bravly!

config NO_WPTR
	def_bool y

choice
	prompt "Choice your CPU arch"
	config ARM_T
		bool "ARM_Samsung"

	config MIPS_T
		bool "MIPS_Cavium"

	config POWERPC_T
		bool "Power PC"

	config X86_T
		bool "Intel X86"

endchoice

choice
	prompt "Target Platform Model"
	config  ARM_S3C2410_T
		bool "s3c2410"
		depends on ARM_T

	config ARM_S3C6410_T
		bool "s3c6410"
		depends on ARM_T

	config ARM_EXYNOS4412_T
		bool "Exynos4412"
		depends on ARM_T

	config ARM_EXYNOS5410_T
		bool "Exynos5410"
		depends on ARM_T

	config MIPS_CAVM_OCTEON1_T
		bool "Cavium OCTEON I"
		depends on MIPS_T

	config MIPS_CAVM_OCTEON2_T
		bool "Cavium OCTEON II"
		depends on MIPS_T

	config MCU_51_T
		bool "MCU ATMEL 51"
		depends on MCU_T

endchoice

menu "Hardware settings"
	config SUPPORT_LINUX
		bool "Support Linux"
		default y if ARM_T || MIPS_T || X86_T || POWERPC_T || SH_T

	config MCPU
		int "CPU numbers used in MCPU platform"
		default y if ARM_T || MIPS_T

	config CPU_NUM
		int "CPU numbers used in MCPU platform"
		default 2
		depends on MCPU

	config CORE_NUM
		int "Cores per CPU"
		range 1 12 if MIPS_CAVM_OCTEON1_T
		range 1 12 if MIPS_CAVM_OCTEON2_T
		default "12" if MIPS_T
		range 1 8 if ARM_T
		default "4" if ARM_EXYNOS4412_T
		default "8" if ARM_EXYNOS5410_T

	config ARENA_MEM_SIZE
		int "Default memory size of arena manager"
		default "500000000"

	config GPIO_MASK_CPU
		hex "GPIO mask of CPU"
		default 0x1 if ARM_S3C2410_T || ARM_S3C6410_T
		depends on MCPU

	config HFA
		bool "Enable Hyper Finite Automata"
		default y if MIPS_CAVM_OCTEON1_T || MIPS_CAVM_OCTEON2_T
		depends on MIPS_T

		if HFA
		menu "HFA hardware configure"
		config HFA_BUF_NUM
			int "HFA input/temp buffers's number"
			default 400

		config HFA_THD_NUM
			int "HFA thread buffers's number"
			default 400

		config HFA_MEM_SIZE
			int "HFA memory size (in mega bytes)"
			default 1024
		endmenu
		endif

	if MIPS_T
	config ETHERNET_PORT
		int "Ethernet port number (range 1 50)"
		default 2
		range 1 50
	config GPIO_PORT
		int "GPIO port number (range 1 1000)"
		default 100
		range 1 1000
	endif
endmenu
```

如果在退出时选择了 yes, 会将配置保存到 .config 里. 
之后就可以 make 了