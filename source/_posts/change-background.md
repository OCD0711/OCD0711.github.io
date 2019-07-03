---
title: Next 主题自动更换背景图片
author: OCD
tags:
  - theme-NexT
  - unsplash
categories:
  - Hexo
date: 2018-09-29 09:44:00
---
如果觉得 NexT的空白主题看腻了或者太多人用觉得不够个性化，那么不妨试试自动更新背景图片。

<!-- more -->

## 实现原理

### 图片来源

自动更换背景的实现是修改添加背景的 css 样式实现。图片来源是 [unsplash](https://source.unsplash.com/)

这个网站，里面不仅免费提供了很多高清美图，而且还提供api接口调用，实在是良心。这里实现的原理也是调用了这个网站的接口。

## 修改背景样式

修改themes\next\source\css\
_custom\custom.styl文件，这个是Next故意留给用户自己个性化定制一些样式的文件，添加以下代码：

``` CSS
body {

    background:url(https://source.unsplash.com/random/1600x900);

    background-repeat: no-repeat;

    background-attachment:fixed;

    background-position:50% 50%;

}
```

如果自己不喜欢这个网址提供的图片做背景，那么修改url()里面的路径即可。repeat、attachment、position就是调整图片的位置，不重复出现、不滚动等等。

## 修改不透明度

完成这一步其实背景就会自动更换了，但是会出现一个问题，因为next主题的背景是纯透明的，这样子就造成背景图片的影响看不见文字，这对于博客来说肯定不行。

那么就需要调整背景的不透明度了。同样是修改themes\next\source\css _custom\custom.styl文件。在后面添加如下代码

``` CSS
.main-inner { 

    margin-top: 60px;

    padding: 60px 60px 60px 60px;

    background: #fff;

	opacity: 0.8;

    min-height: 500px;

}
```

* background: #fff; 白色
* opacity: 0.8;不透明度

## 效果

完成上述设置，我们来看看效果

![](https://github.com/OCD0711/MyPostImages/raw/master/006tNc79gy1fvq67w13yqj31kw0x2u0z.jpg)