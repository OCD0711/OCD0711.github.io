---
title: raspi 上 CP2102 使用
author: "OCD"
date: 2019-01-14 11:36:46
category:
    - Raspi
tags:
    - raspi
    - Serial Communications
---

## 测试 usb hub 接 cp2102 模块的 usb 转串口在 raspi 上的数据收发 

1. 将 hub 的一个 usb 口的4个引脚与 cp2102 模块的 usb 口的4个引脚进行焊接(注意线的对应, 红、白、绿、黑，vcc、d-、d+、gnd)

2. 用一个母口的杜邦线, 短接 cp2102 模块引出来的 txd 与 rxd.

![](https://ws2.sinaimg.cn/large/006tNc79gy1fz5yxib2ncj30ts06qwkz.jpg)

3. 在 raspi 上安装 minicom, 并进行配置, sudo minicom -s (不能直接 minicom，权限不够), 注意设置的一处为 serial port setup 

![](https://ws1.sinaimg.cn/large/006tNc79gy1fz5yokj59tj30oa0l6wsk.jpg)

的 a-serial device 处, 改为 /dev/ttyUSB0 (与usb转串口的对应), f-hardware flow control 改为 no (时间允许的话, 也可以测试一下, yes)

![](https://ws2.sinaimg.cn/large/006tNc79gy1fz5yr15qw2j30uy0jc4gf.jpg)

4. 用 minicom 发送文件, 可以看到 minicom 的界面中也会收到发送的数据, 只不过如果发送的文件中的数据太多, 收到的是数据量不够, 仅会收到末尾几行.(这个猜测可能与 cp2102 的 fifo 的大小有关). 

例:
![](https://ws3.sinaimg.cn/large/006tNc79gy1fz5yuffy99j30u0199u0x.jpg)

经测试, 当 e-bps/par/bits 设为 6n1 时或 6n2 或 6e1 或 6e2 时, 能接收到数据, 但打印出来的不是原始数据.
如: 
原始数据为 
1 test1 
2 test2 
3 test3 
4 test4 
5 test5 
6 test6 
而接收到的数据为 
1 4%341 
2 4%342 
3 4%343 
4 4%344 
5 4%345 
6 4%346 
当设为 7n1、7n2、7e1 或 7e2 时, 及 8n1 等 8 个数据位的其他情况时, 都可以接收到正确的数据.
而当设为 5 个数据位时, 可能收不到数据, 也可能收到了, 但屏幕上是没显示东西的.
总之数据位设为 5 和 6 时, 是不能正确收发数据的, 数据位设为 7 或 8 时, 可以正确地收发数据.