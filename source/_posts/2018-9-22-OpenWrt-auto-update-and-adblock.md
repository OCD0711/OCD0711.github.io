---
title: OpenWrt 自动更新设置和屏蔽广告
author: OCD
tags:
  - 广告过滤
categories:
  - 路由器
date: 2018-09-22 15:55:00
---

## OpenWrt 路由器自动更新国内重要网站名单
****

登陆路由器后:

```
root@OpenWrt:~# cd /usr/bin
root@OpenWrt:~# touch chinalist
root@OpenWrt:~# chmod +x chinalist
root@OpenWrt:~# vi chinalist
```

/usr/bin/chinalist:

```
#!/bin/sh                                                                                                                                                               

wget -4 --no-check-certificate -O /etc/dnsmasq.d/accelerated-domains.china.conf https://github.com/felixonmars/dnsmasq-china-list/raw/master/accelerated-domains.china.conf
wget -4 --no-check-certificate -O /etc/dnsmasq.d/bogus-nxdomain.china.conf https://github.com/felixonmars/dnsmasq-china-list/raw/master/bogus-nxdomain.china.conf
```

## OpenWrt 路由器自动屏蔽广告
****

/etc/dnsmasq.d 下有个 blockad.conf 文件, 内容如下:

```
server=/.mobads.baidu.com/127.0.0.0
server=/.mobads-logs.baidu.com/127.0.0.0
server=/.media.admob.com/127.0.0.0
...
```

意思是 /mobads.baidu.com 的域名解析转发到 127.0.0.0, 这个地址不具备域名解析的功能, 于是就达到了屏蔽广告的功能.

运行命令:

```
root@OpenWrt:~# cd /usr/bin
root@OpenWrt:~# touch blockad
root@OpenWrt:~# chmod +x blockad
root@OpenWrt:~# vi blockad
```

/usr/bin/blockad:

```
#!/bin/sh

# Author:    https://github.com/softwaredownload/openwrt-fanqiang
# Date:        2016-01-09

TMP_HOSTS=/tmp/block.hosts.unsorted
HOSTS=/etc/dnsmasq.d/blockad.conf

# remove any old TMP_HOSTS that might have stuck around
rm ${TMP_HOSTS} 2> /dev/null

for URL in \
    "https://raw.githubusercontent.com/vokins/simpleu/master/hosts" \
    "http://adaway.org/hosts.txt"
do
    # filter out comment lines, empty lines, localhost... 
    # remove trailing comments, space( ,tab), empty line
    # replace line to dnsmasq format
    # remove carriage returns
    # append the results to TMP_HOSTS
    wget -4 --no-check-certificate -qO- "${URL}" | grep -v -e "^#" -e "^\s*$" -e "localhost" -e "^;" -e "^@" -e "^:" -e "^[a-zA-Z]" \
    | sed -E -e "s/#.*$//" -e "s/[[:space:]]*//g" -e "/^$/d" \
    -e "s/^127.0.0.1/server=\/./" -e "s/0.0.0.0/server=\/./" -e "/^[0-9].*$/d" -e "s/$/\/127.0.0.0/" \
    | tr -d "\r" >> ${TMP_HOSTS}

done

# remove duplicate hosts and save the real hosts file
sort ${TMP_HOSTS} | uniq > ${HOSTS}

rm ${TMP_HOSTS} 2> /dev/null
```

OpenWrt 自动生成广告屏蔽列表说明:

第一个 URL 主要用于国内, 下面几个 URL 是屏蔽国外广告
运行上面命令产生的广告屏蔽列表比较长, 如果路由器性能较差, dnsmasq 匹配域名负荷会太大, 可以用下面这个简化版的文件, 不要用上面的脚本:

> https://github.com/softwaredownload/openwrt-fanqiang/blob/master/openwrt/dir505/etc/dnsmasq.d/blockad.conf

如果dnsmasq超负荷工作，可能会失去响应，导致打不开网页，这时需要登录路由器运行命令：

`/etc/init.d/dnsmasq restart`

所以，还是尽量用性能好点的路由器吧
路由器性能比电脑差很多，如果屏蔽列表很长，那么短时间内快速打开数个网页就可能导致dnsmasq失去响应。最好是看完一个网页就关闭一个，再打开新的网页。
在路由器里屏蔽的好处是所有接入路由器的设备都全部起作用。
通常的做法，在路由器里屏蔽部分域名，然后在电脑里设置更广泛、精确的屏蔽，主要是设置host文件屏蔽和浏览器插件屏蔽。
浏览器插件屏蔽，可以装这些Chrome浏览器插件：uBlock Origin，ADfree.Player.Online。其中uBlock Origin的作用和Adblock Plus类似，但是设置更加丰富。

## 计划任务：定时更新dnsmasq配置文件和自动重启shadowsocks
***

```
root@OpenWrt:~# crontab -e
```

输入以下内容:

```
*/30 * * * * isfound=$(ps | grep "ss-redir" | grep -v "grep"); if [ -z "$isfound" ]; then echo "$(date): restart ss-redir...">>/tmp/log/ss-monitor.log && /etc/init.d/shadowsocks restart; fi
* 12 * * * /usr/bin/chinalist
* 12 * * * /usr/bin/blockad
```

OpenWrt计划任务说明：

* 每半小时检查shadowsocks-libev 客户端，如果退出就自动重启
* 每天中午12点运行chinalist
* 每天中午12点运行blockad

2014-09-24版的dir505, wr2543预编译固件是启用了计划任务的，这会有潜在的不确定性，如果更新时下载的文件如accelerated-domains.china.conf存在错误，导致dnsmasq无法启动，翻墙功能自然失效。

如果你启用了计划任务，某一天突然不能翻墙了，这时设置客户端的IP地址为和路由器同网段，登录路由器，用ps命令查看dnsmasq进程是否启动了，如果没有启动，就重刷固件或者用[点击跳转](https://github.com/softwaredownload/openwrt-fanqiang/tree/master/openwrt/default/etc/dnsmasq.d “https://github.com/softwaredownload/openwrt-fanqiang/tree/master/openwrt/default/etc/dnsmasq.d”)
下面的文件代替 路由器里/etc/dnsmasq.d/下的文件。

## 附录：计划任务定时关闭路由器OpenWrt
***

人类的本性是目光短浅，玩得一时兴趣就会忘记定时休息的重要性。解决办法是在路由器里设置计划任务，禁止夜里某个时间段里使用路由器。下面的例子中，每20分钟检测一次，如果迟于20点30或者早于7点就自动关闭OpenWrt。这对小孩子特别有用，现在很多孩子使用电子设备上瘾，一个人睡的话甚至半夜在被窝里偷偷上网，现在好了，除非孩子强大到会登陆路由器修改设置，否则半夜重启路由器都无法上网了。

```
*/20 * * * * TIME=$(date +"%H%M"); if [ $TIME -ge 2030 ] || [ $TIME -le 700 ]; then poweroff; fi
```

## 参考:

> https://github.com/vokins/simpleu
> https://github.com/jjack/openwrt-adblock
> https://github.com/felixonmars/dnsmasq-china-list
> install-shadowsocks-on-hg255d-openwrt-and-config-nat
> https://pcjetzt.com/vpn-test-besten-vpn-anbieter-im-vergleich/
