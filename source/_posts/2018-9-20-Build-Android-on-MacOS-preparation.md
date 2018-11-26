---
title: Build Android on MacOS preparation
author: "OCD"
date: 2018-09-20 09:26:01
tags:
    - Android Build
    - MacOS
category:
    - Android Build
---

This passage introduces a way to build Android on MacOS (NEW)

<!-- more -->

__Caution__: 由于最新Xcode9编译Android源码问题很多，使用旧版Xcode 8.3.3

## 编译前的准备工作

__Xcode8.3.3__
1. 下载地址:(https://download.developer.apple.com/Developer_Tools/Xcode_8.3.3/Xcode8.3.3.xip)

2. 切换Xcode版本
`$ xcode-select --switch $PATH/Xcode.app`

__编译需要的软件包__
1. ([brew](https://brew.sh/) 使用详见官网)
```
$ brew install bash-completion coreutils e2fsprogs findutils	git gnu-sed gnupg gnutls imagemagick make maven md5sha1sum openssl repo sdl sdl2
```

2. 环境变量
`$ vim ~/.bash_profile`
```
PATH=/usr/local/opt/coreutils/libexec/gnubin:/usr/local/opt/findutils/libexec/gnubin:/usr/local/opt/gnu-sed/libexec/gnubin:/usr/local/opt/make/libexec/gnubin:$PATH
```

__Set the number of open files to be 1024__

`ulimit -S -n 1024`

__Jack memory__

    export ANDROID_JACK_VM_ARGS="-Dfile.encoding=UTF-8 -XX:+TieredCompilation -Xmx4G"


__python2__

1. 编译时用到python2命令，mac里只有python2.7 软链接成python2即可
`$ ln /usr/bin/python2.7 /usr/bin/python2`

__bison报错__

1. 目前Android源码自带的bison不兼容macOS10.13新引入的一些安全限制。需要打补丁编译并替换源码自带的bison。以后源码更新应该会修复就不需要了
>详情可见 [android-building](https://groups.google.com/forum/?fromgroups#!topic/android-building/D1-c5lZ9Oco)

```
​$ cd external/bison

$ git cherry-pick c0c852bd6fe462b148475476d9124fd740eba160

$ mm

$ cp out/host/darwin-x86/bin/bison prebuilts/misc/darwin-x86/bison/bison
```

## 除了环境配置和编译时的几个问题，其他和在Linux下编译区别不大​​​​