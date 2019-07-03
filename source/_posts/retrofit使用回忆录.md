---
layout: retrofit 使用回忆录
author: "OCD"
title: 使用回忆录
date: 2019-02-07 20:16:31
category:
    - java
tags:
    - java
    - android
    - 网络层
---
## 00 序言

就是一篇之前学习 retrofit 使用中的过程小节...
***


Retrofit 在项目使用中的流程: 创建 Bean 类 --> 创建接口形式的 http 请求方法 --> 通过 Retrofit.builder() 创建接口对象并调用 http 方法请求网络数据 --> 在 RxJava 中 Observable (被观察者) 中异步处理请求结果


## 01 Retrofit HTTP 请求方法注解的字段说明
***
Retrofit 进行网络请求的 URL 分为两部分: BaseURL 和 relativeURL. BaseURL 需要以 “/” 结尾, 一般不需要变化直接定义即可(域名), 当然特殊的情况下, 比如后一次网络访问 URL 需要从前一次访问结果中获取相关参数, 那么就需要动态的操作 URL, 这种用法会在后面介绍; relativeURL 就是请求参数相关, 所以每个 request 方法都需要 http annotation 来提供请求的 relativeURL, Retrofit 内置的注视有五个: `GET, POST, PUT, DELETE, HEAD`. 这些注解在使用时涉及到哪些相关字段, 下面引用一张图

![](https://github.com/OCD0711/MyPostImages/raw/master/006tNc79gy1fzy50n412uj30hn09e0so.jpg)
