---
title: Hexo-NexT 主题修改页面透明度及页面颜色
author: OCD
tags:
  - NexT
categories:
  - Hexo
date: 2018-09-26 16:33:00
---
由于NexT主题默认的背景是不透明的，如果我们设置的有canvas_nest和canvas_three等3D动画效果，则会被文章界面遮住，本文主要讲述如何修改Hexo站点的页面透明度。

主要是通过修改CSS样式来实现

## 文章部分
****

> 文件位置 ~Hexo根目录/themes/next/source/css/_schemes/Gemini/index.style
```
// Post & Comments blocks.
.post-block {
  padding: $content-desktop-padding;
- background: white;
+ background: rgba(255,255,255,0.7);
  box-shadow: $box-shadow-inner;
  border-radius: $border-radius-inner;
}
```

## 阅读全文按钮
****

> 文件位置 ~Hexo根目录/themes/next/source/css/_variables/Pisces.style
```
// Button
  $btn-default-radius           = 2px
- $btn-default-bg               = white
+ $btn-default-bg               = rgba(255,255,255,0.5)
  $btn-default-color            = $text-color
  $btn-default-border-color     = $text-color
  $btn-default-hover-color      = white
  $btn-default-hover-bg         = $black-deep
```

## 分页部分
****

> 文件位置 ~Hexo根目录/themes/next/source/css/_schemes/Gemini/index.style
```
// Pagination.
.pagination {
  .prev, .next, .page-number {
    margin-bottom: initial;
    top: initial;
  }
  margin: sboffset 0 0;
- background: white;
+ background: rgba(255,255,255,0.7);
  box-shadow: $box-shadow;
  border-radius: $border-radius;
  padding: 10px 0 10px;
}
```

## 评论区部分
****

> ~Hexo根目录/themes/next/source/css/_schemes/Gemini/index.style
```
// Comments blocks.
.comments {
  padding: $content-desktop-padding;
  margin: initial;
  margin-top: sboffset;
- background: white;
+ background: rgba(255,255,255,0.7);
  box-shadow: $box-shadow;
  border-radius: $border-radius;
}
```

## 侧栏菜单界面
****

>文件位置 ~Hexo根目录/themes/next/source/css/_schemes/Pisces/_layout.style
```
.header-inner {
  position: absolute;
  top: 0;
  overflow: hidden;
  padding: 0;
  width: $sidebar-desktop;
- background: white;
+ background: rgba(255,255,255,0.7);
  box-shadow: $box-shadow-inner;
  border-radius: $border-radius-inner;

  +desktop-large() {
    .container & { width: $sidebar-desktop; }
  }
  +tablet() {
    position: relative;
    width: auto;
    border-radius: initial;
  }
  +mobile() {
    position: relative;
    width: auto;
    border-radius: initial;
  }
}
```

## 个人资料界面
****

> 文件位置 ~Hexo根目录/themes/next/source/css/_schemes/Pisces/_sidebar.style
```
.sidebar-inner {
//padding: 20px 10px 0;
  box-sizing: border-box;
  width: $sidebar-desktop;
  color: $text-color;
- background: white;
+ background: rgba(255,255,255,0.7);
  box-shadow: $box-shadow;
  border-radius: $border-radius;
  if (hexo-config('motion.enable') and hexo-config('motion.transition.sidebar')) { opacity: 0; }

  &.affix {
    position: fixed;
    top: $sidebar-offset;
  }
```