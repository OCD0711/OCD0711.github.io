---
title: OpenWRT自动更新软件包脚本
author: "OCD"
date: 2018-10-17 11:03:26
mathjax: true
category:
    - 路由器
tags: 
    - OpenWRT
---

首先新建一个shell脚本文件，如/root/autoupgrade.sh，加上执行权限，写入以下几行：
``` sh
#!/bin/sh
opkg update
for ipk in $(opkg list-upgradable | awk '$1!~/^kmod|^Multiple/{print $1}'); do
opkg upgrade $ipk
done
```

然后加入到计划任务中：
```
#  文件格式说明
#  ——分钟 (0 - 59)
# |  ——小时 (0 - 23)
# | |  ——日   (1 - 31)
# | | |  ——月   (1 - 12)
# | | | |  ——星期 (0 - 7)（星期日=0或7）
# | | | | |
# * * * * * 被执行的命令
# 0 1 * * * /root/autoupgrade.sh

```