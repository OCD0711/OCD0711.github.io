---
title: Sony_Headphone_Connect_update_google_assistant
date: 2018-11-09 14:53:03
author: OCD
tags:
  - sony
  - sony headphone connect
  - android app 反编译修改
categories:
  - Android App
---

前阵子 jd 入了个大法的 WH-1000XM2, 国行缺少了 google assistant,外加大妈的中文提示语音...实在是难受, 然后找刷成国际版的方法. google 一圈貌似已经发布了 2.0.1 的固件, 但配套的程序没提示更新.

## 警告

这篇讲的内容并不受 Sony 官方支持, 本人也并不对此造成的保修作废、耳机变砖、耳机电池爆炸等等问题负责. 尝试此方法带来的任何后果自负. 本文内容仅适用于 WH-1000XM2, 其余型号请自行研究. 本文所提供的内容针对 Sony Headphone Connect 3.2.0 版本.

## 准备工具

* apktool
* 一个靠谱的文本编辑器

## 过程

> 提醒: 你用别的方法反编译后类、方法、命名空间等的命名方式不一定与我的相同, 建议善用文本搜索

手机上抓包,发现软件启动的时候请求 `https://info.update.sony.net/HP001/MDRID289202/info/info.xml`, 居然返回的是404. 不负责的猜测了一下 MDRID289202 是机身的内部型号(包括版本号). 全局搜索了下源码发现`MDRID289202` 在 `com.sony.songpal.mdr.automagic.AutoMagicManager` 里面.

``` java
private URL m9721d(String str, String str2) {
    String str3 = "info.update.sony.net";
    if (str == null) {
        throw new IllegalStateException(String.format(Locale.getDefault(), "%s:code=%d", new Object[]{"AutoMagicManagerErrorDomain", Integer.valueOf(AutoMagicError.NoCategoryID.ordinal())}));
    } else if (str2 == null) {
        throw new IllegalStateException(String.format(Locale.getDefault(), "%s:code=%d", new Object[]{"AutoMagicManagerErrorDomain", Integer.valueOf(AutoMagicError.NoServiceID.ordinal())}));
    } else {
        try {
            return new URL(String.format(Locale.getDefault(), "http://%s/%s/%s/info/%s", new Object[]{str3, str, str2, "info.xml"}));
        } catch (Throwable e) {
            SpLog.m12039a(f5487a, e);
            return null;
        }
    }
}
```

这玩意用了两个字符串类的参数, 然后在 URL 里面就是 HP001 和 MDRID289202, 于是猜测假如我篡改这个参数的获取程序使其获取成国外行货的代码, 大概就能强制更新了(前提是硬件完全一样). 顺藤摸瓜检查 m9271d 这方法的调用, 查到了保存这个参数的类 com.sony.songpal.mdr.application.p061b.C1702a.

``` java
void m7942a(C2503b c2503b) {
    if (Command.fromByteCode(c2503b.m11224a()) == Command.UPDT_RET_PARAM) {
        cm cmVar = (cm) c2503b;
        if (cmVar.m11579e() != this.f4438n) {
            SpLog.m12040b(f4425a, this.f4438n + " expected, but received " + cmVar.m11579e());
            return;
        }
        af f = cmVar.m11580f();
        switch (cmVar.m11579e()) {
            case CATEGORY_ID:
                this.f4429e = ((ag) f).m11716a();
                break;
            case SERVICE_ID:
                this.f4430f = ((ag) f).m11716a();
                break;
            case NATION_CODE:
                this.f4431g = ((ag) f).m11716a();
                break;
            case LANGUAGE:
                this.f4432h = ((ag) f).m11716a();
                break;
            case SERIAL_NUMBER:
                this.f4433i = ((ag) f).m11716a();
                break;
            case BATTERY_POWER_THRESHOLD:
                this.f4434j = ((ae) f).m11711a();
                break;
            default:
                throw new IllegalStateException("Invalid inquired type " + cmVar.m11579e() + " was expected");
        }
        if (this.f4437m != null) {
            this.f4437m.countDown();
        }
    }
}
```

SMALI 指令码对应如下(com.sony.songpal.mdr.application.b.a)

```
.line 156
    :pswitch_1
    check-cast v0, Lcom/sony/songpal/tandemfamily/message/mdr/param/ag;
 
    invoke-virtual {v0}, Lcom/sony/songpal/tandemfamily/message/mdr/param/ag;->a()Ljava/lang/String;
 
    move-result-object v0
 
    iput-object v0, p0, Lcom/sony/songpal/mdr/application/b/a;->f:Ljava/lang/String;
 
    goto :goto_1
```
把这玩意的SERVICE_ID那改成外国行货的ID就好了. 比如

``` java
case SERVICE_ID:
    this.f4430f = "MDRID123456";
    break;
```

但问题来了, 不知道外国行货的 ID 是多少, 可能ID是连着的, 于是我试了试 MDRID289200, 确认有这个型号. 于是修改 Apktool 解包的 SMALI 为

```
.line 156
    :pswitch_1
    #check-cast v0, Lcom/sony/songpal/tandemfamily/message/mdr/param/ag;
 
    #invoke-virtual {v0}, Lcom/sony/songpal/tandemfamily/message/mdr/param/ag;->a()Ljava/lang/String;
 
    #move-result-object v0
 
    const-string v0, "MDRID289200"
 
    iput-object v0, p0, Lcom/sony/songpal/mdr/application/b/a;->f:Ljava/lang/String;
 
    goto :goto_1
```

重新用 Apktool 打包, 然后用自己的证书签名. 传到手机那, 成功检测到更新. 实测貌似没啥毛病，更新成了国外版本的 2.0.1 固件并且语音变成了英文. 于是自己也试了一下, 更新后貌似确实没啥毛病.

装回原版程序后再次用抓包抓了一下, 发现请求的 service id 已经变成了 MDRID289200. 大概不用担心以后又变回国行固件的问题.

## 简要教程

1. 用Apktool解包: `apktool d a.apk` (我为了方便文件名改成了a.apk), 这一步会创建一个名为a的文件夹
2. 进入文件夹, 全局搜索`invoke-virtual {v0}, Lcom/sony/songpal/tandemfamily/message/mdr/param/ag;->a()Ljava/lang/String;`, 打开包含这一行的文件.
3. 跳至 `.line 156`, 把里面的内容修改成我上面所述的内容.
4. 重新打包: `apktool b a -o b.apk`, 这会生成b.apk
5. 给b.apk签名, 这个网上都有教程我就不写了
6. 把原本的App卸掉, 安装这个APK, 然后连接耳机, 如果没毛病的话应该会见到底部的更新提示, 按部就班更新就行
7. 把原本的App卸掉, 安装这个APK, 然后连接耳机, 如果没毛病的话应该会见到底部的更新提示, 按部就班更新就行

****