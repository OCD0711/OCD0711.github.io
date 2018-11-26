---
title: 在 macOS 编译 Android 的尝试
date: 2017-11-15 1
author: "OCD"
Category:
    - PLAY
tags: 
    - Android build
    - Develop
---
尝试在 macOS 10.13 上编译 Android LineageOS 14.1 备份以便将来使用
<!-- more -->

## 1. 环境搭建

### 1.1 repo

```bash
brew install repo
```

### 1.2 准备硬盘(镜像)

我的办法使直接从移动硬盘上割了一块以储存 Android 源码, 格式应当设置为 macOS拓展 日志式 `区分大小写`

### 1.3 准备源码

从 GitHub 同步 Lineage 14.1 源码

```bash
repo init -u git://github.com/LineageOS/android.git -b cm-14.1
repo sync -j4
```

唔，作为 IPv6 用户，同步速度 10M/s 无压力呀。
如遇速度慢请使用 USTC 镜像代替 Google Source 进行同步，必要时可能需要爱国XD～

### 1.4 Xcode 降级

在同步代码的时候，我们可以进行一些其他工作~~为编译的顺畅进行做好准备~~
Xcode 9 的 SDK 对 Android 7.1 十分不友好， 因此，建议从 [Apple Developer](https://developer.apple.com/download/more/) 下载 Xcode 8.3.3.
将 Xcode8.3.3.app 移动到 /Application 中， 然后运行

```bash
xcode-select -p /Application/Xcode8.3.3.app
```

### 1.5 Java 安装

编译 Lineage14.1 需要 [JDK8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), 如果安装了JDK 9 你还是先卸了吧。。。毕竟我是没法子转 JDK Version.

```bash
#卸载Java9
sudo rm -fr /Library/Internet\ Plug-Ins/JavaAppletPlugin.plugin
sudo rm -fr /Library/PreferencePanes/JavaControlPanel.prefPane
sudo rm -fr ~/Library/Application\ Support/Java
sudo rm -fr /Library/Java/JavaVirtualMachines/jdk-9.jdk
```

然后即可安装 JDK 8.
安装后确认:

```bash
➜ java -version
java version "1.8.0_151"
Java(TM) SE Runtime Environment (build 1.8.0_151-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)
```

### 1.6 依赖安装

唔 这个参考 [Android Source](https://source.android.com/source/initializing)

## 2. 开始编译

### 2.1 设置环境变量

```bash
# ccache
export USE_CCACHE=1             # 开启 CCACHE
export CCACHE_DIR=/<path_of_your_choice>/.ccache # 设置 CCACHE 文件夹
prebuilts/misc/darwin-x86/ccache/ccache -M 50G    # 设置 CCACHE 大小
```

也可以将上述写入 ~/.bash_profile 以避免重复输入。。

### 2.2 对内核进行修改

#### 2.2.1 gsed

我们注意到 `brew install gnu-sed` 使用的是 `gsed` 命令。
因此我们要对 kernel source 中的脚本进行修改。

```diff
--- a/scripts/headers_install.sh
+++ b/scripts/headers_install.sh

-   sed -r \
+   gsed -r \
```

```diff
--- a/arch/arm64/kernel/vdso/gen_vdso_offsets.sh
+++ b/arch/arm64/kernel/vdso/gen_vdso_offsets.sh

- sed -n -e 's/^00*/0/' -e \
+ gsed -n -e 's/^00*/0/' -e \
```

#### 2.2.2 xargs

Mac 的 xargs 与Linux存在差别，因此进行修改:

```bash
brew install findutils
```

```diff
--- a/scripts/Makefile.modpost
+++ b/scripts/Makefile.modpost

- MODLISTCMD := find $(MODVERDIR) -name '*.mod' | xargs -r grep -h '\.ko$$' | sort  -u
+ MODLISTCMD := find $(MODVERDIR) -name '*.mod' | gxargs -r grep -h '\.ko$$' | sort  -u
```

### 2.3 Bison

Bison requires a commit to work.

```bash
# in the root of the source code
cd external/bison
git cherry-pick c0c852bd6fe462b148475476d9124fd740eba160
cd ../../
mm bison
cp out/host/darwin-x86/bin/bison prebuilts/misc/darwin-x86/bison/

# Credits: https://groups.google.com/forum/#!topic/android-building/D1-c5lZ9Oco
```

## 3. Here wo go

``` bash
breakfast <device_name>         # 从 Lineage 的 repo 上下载 device kernel 等
git clone https://github.com/TheMuppets/<repo> vendor/<device_name>
                                # 从 TheMuppets 的 repo 下载 vendor 文件
lunch lineage_<device_name>-userdebug
make -j<cpu_num> bacon          # 开始编译
```

### 3.1 out of memory error

诶机器差的命啊:

```bash
export JACK_SERVER_VM_ARGUMENTS="-Dfile.encoding=UTF-8 -XX:+TieredCompilation -Xmx4096m" \
jack-admin kill-server && jack-admin start-server \
make -j<cpu_num> bacon
```

## 4. Job done

没什么好写的233333
我什么也不会呀

注: 当初找 xargs 的 GNU 版本找了很久, 现在发现奇淫技巧:

```bash
➜ brew search --desc xargs
findutils: Collection of GNU find, xargs, and locate
```

## Special Thanks

@Asuka
@XINGRZ


