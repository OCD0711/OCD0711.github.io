---
title: clover 注入白果三码实现 imessage 正常使用
author: OCD
tags:
  - MacOS
  - Clover
  - iMessage
  - FaceTime
  - ''
categories:
  - 黑苹果
date: 2018-09-21 09:11:00
---
__注入白果三码实现 iMessage 与 FaceTime 正常使用__

<!-- more -->

## 前言


> 此法需建立在你有白苹果信息的情况下才能使用
> 完成后你将登陆任意appleid都不需要打电话激活

## 工具
首先你需要 iMessageDebug 这个工具来读取白果的三码

iMessageDebug 使用起来很方便首先需要一台白苹果，下载到机器上，或者U盘拷贝。。。。

1. 将 iMessageDebug 文件拖到桌面
2. 打开终端
3. 输入（chmod a+x ）桌面的 iMessageDebug 拖入终端按回车键（也许要输入用户密码）
3. sh iMessageDebug

这样就获得了三码了，选择y是将三码生成文本发送到 Download 文件夹。

## Clover 的配置

![overwrote existing file](/images/image.png)

填入主板MLB序列号和ROM（MLB就是BoardSerialNumber：XXXXXX）

![upload successful](/images/image1.png)

1. BoardSerialNumber 上写入你的mlb码（其实可不写）
2. “重点” smuuid 上写你的Hardware UUID，一定要照搬 不要改写后 12 位为 rom 码
3. 序列号填写

![upload successful](/images/image2.png)

1. (重点)写入你的 System-ID
2. 注入 kext 是配置 clover 必选的
3. 就是最重点的了 一定务必开启 inject System ID,如果不选的话，会导致 custom uuid 和 System-ID 数据颠倒