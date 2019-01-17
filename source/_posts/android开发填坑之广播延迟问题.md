---
title: android开发填坑之广播延迟问题
author: "OCD"
date: 2019-01-17 11:44:57
category:
    - android app
tags:
    - android
    - broadcast
---
## 前言

在写公司项目, 项目验收的时候挖出了历史遗留的bug, 经过分析功能依赖系统的屏幕监听广播 (ACTION_SCREEN_ON 和 ACTION_SCREEN_OFF). 但是这里有个深坑, 广播发送有延迟...当我们短时间迅速开关屏幕, 功能正常...但是实际使用中全看运气...

刚开始想通过前台广播解决, 但是只有自定义广播可以设置前台, 系统广播无法设置, 这种解决方案被放弃..最终解决方案: 在 View 中重写 View.onScreenStateChanged, 通过回调实现监听.

## View.onScreenStateChanged

源码如下:

``` java
/**
 * This method is called whenever the state of the screen this view is
 * attached to changes. A state change will usually occurs when the screen
 * turns on or off (whether it happens automatically or the user does it
 * manually.)
 *
 * @param screenState The new state of the screen. Can be either
 *                    {@link #SCREEN_STATE_ON} or {@link #SCREEN_STATE_OFF}
 */
public void onScreenStateChanged(int screenState) {
}
```

可以看到注释中写到: 这个方法在屏幕开关都会触发这个方法, 参数列表中 __int screenState__ 代表屏幕开关状态


## 实现方案

在我们自定义 View 中, 重写这个方法, 并且加回调, 就可以实现跟踪屏幕效果.

1. __View 中重写__

``` java
// 添加屏幕监听
    @Override
    public void onScreenStateChanged(int screenState){
        super.onScreenStateChanged(screenState);
        if (mCallback != null){
            mCallback.onScreenState(screenState);
        }

    }
```

2. __定义回调__

``` java
//添加回调接口
    public interface DragLayerCallback {
        public static final int SCREEN_OFF = 0;
        public static final int SCREEN_ON = 1;
        void onScreenState(int screenState);
    }
```

3. __注册回调__

``` java
public void setScreenStateCallback(DragLayerCallback callback) {
    this.mCallback = callback;
}
```

4. 在需要监听的地方实现

``` java
mDragLayer.setScreenStateCallback(new DragLayer.DragLayerCallback() {
     @Override
    public void onScreenState(int screenState) {
        // 开启屏幕
        if (screenState==DragLayer.DragLayerCallback.SCREEN_ON){
            screenOn();
        }
        // 关闭屏幕
        else {
            screenOff();
        }
    }
});
```