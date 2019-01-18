---
title: Android-P破解隐藏私有API禁止调用的限制
author: "OCD"
date: 2019-01-18 11:23:00
category:
    - Android
tags:
  - android app
  - Develop
---

## 参考

> http://weishu.me/2018/06/07/free-reflection-above-android-p/

> https://juejin.im/post/5ba0f3f7e51d450e6f2e39e0

原理链接已经提供了，这里不做解释。

维术的第二个条件和掘金的方法五，虽然提到了Unsafe，但是都没有给出源码。
现在我把源码发上来，算是这部分的最后一块拼图。

 
```java
    /**
     * 用Unsafe清除classloader
     * 该方法仅对同一个类生效，所以必须在需要的类中添加使用，不可以跨类调用
     *
     * @param cls 需要清除Loader的类
     */
    @SuppressWarnings({"unchecked", "JavaReflectionMemberAccess"})
    public static void clearClassLoaderInClass(Class cls) {
        try {
            //Unsafe类
            Class unsafeClass = Class.forName("sun.misc.Unsafe");
            //取Unsafe实例字段
            Field unsafeInstanceField = unsafeClass.getDeclaredField("theUnsafe");
            //放开Unsafe实例字段权限
            unsafeInstanceField.setAccessible(true);
            //取Unsafe实例
            Object unsafeInstance = unsafeInstanceField.get(null);
            //取objectFieldOffset方法取偏移量
            Method objectFieldOffset = unsafeClass.getMethod("objectFieldOffset", Field.class);
            //Class的classLoader字段
            Field classLoaderField = Class.class.getDeclaredField("classLoader");
            //使classLoader可见
            classLoaderField.setAccessible(true);
            //取putObject方法进行置空
            Method putObject = unsafeClass.getMethod("putObject", Object.class, long.class, Object.class);
            //值为8，这里不用硬编码，看什么时候等到classLoader字段被404了再用
            long offset = (long) objectFieldOffset.invoke(unsafeInstance, classLoaderField);

            Log.i(TAG, "clearClassLoaderInClass: classLoader offset=" + offset);
            //偏移量为8处置空
            putObject.invoke(unsafeInstance, cls, offset, null);
        } catch (Throwable throwable) {
            Log.e(TAG, "clearClassLoaderInClass: ", throwable);
        }
    }
```


用法：

```java
//在当前类下
public class Reflection9 {
    private static void method() {
        //传入当前类
        clearClassLoaderInClass(Reflection9.class);
        //接下来就可以调用隐私API了...
        SystemService.restart("zygote");
    }
}
```


和掘金说的不同，不仅仅反射，直接调用也是可以的，没有此类限制。
