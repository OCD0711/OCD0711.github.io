---
title: ConcurrentLinkedQueue使用
author: "OCD"
date: 2018-12-21 21:01:34
category:
    - java
tags:
    - java
    - android
---

ConcurrentLinkedQueue 笔记


## 定义

一个基于链接节点的无界线程安全列队. 此列队按照 FIFO (先进先出) 原则对元素进行排序. 队列的头部是队列中时间最长的元素. 队列的尾部是队列中时间最短的元素.
新的元素插入到队列的尾部, 队列获取操作从队列头部获取元素. 当多个线程共享访问一个公共 collection 时, ConcurrentLinkedQueue 是一个恰当的选择. 此队列不允许使用 null 元素.


## offer 和 poll

[offer](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/util/concurrent/ConcurrentLinkedQueue.html#offer(E))([E](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/util/concurrent/ConcurrentLinkedQueue.html) e)
将指定元素插入此队列的尾部.

[poll](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/util/concurrent/ConcurrentLinkedQueue.html#poll())
获取并移除此队列的头, 如果此队列为空, 则返回null.

``` java
public static void main(String[] args) {
    ConcurrentLinkedQueue queue = new ConcurrentLinkedQueue();
    queue.offer("嘤嘤嘤");
    System.out.println("offer 后，队列是否空？" + queue.isEmpty());
    System.out.println("从队列中 poll：" + queue.poll());
    System.out.println("pool 后，队列是否空？" + queue.isEmpty());
}
```

offer 是往队列添加元素, poll是从队列取出元素并且删除该元素.

执行结果:
> offer 后, 队列是否为空? false
从队列 poll: 嘤嘤嘤
pool 后, 队列是否为空? true

ConcurrentLinkedQueue 中的 add() 和 offer() 完全一样, 都是往队列尾部添加元素.


## 还有个取出元素方法 peek

[peek](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/util/concurrent/ConcurrentLinkedQueue.html#peek())
获取但不移除此队列的头; 如果此队列为空, 则返回null

``` java
public static void main(String[] args) {
    ConcurrentLinkedQueue queue = new ConcurrentLinkedQueue();
    queue.offer("emmm");
    System.out.println("offer 后, 队列是否空?" + queue.isEmpty());
    System.out.println("从队列中 peek: " + queue.peek());
    System.out.println("从队列中 peek: " + queue.peek());
    System.out.println("从队列中 peek: " + queue.peek());
    System.out.println("pool 后. 队列是否空? " + queue.isEmpty());
}
```

执行结果:
> offer 后，队列是否空? false
从队列中 peek: emmm
从队列中 peek: emmm
从队列中 peek: emmm
pool 后, 队列是否空? false


## remove

[remove](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/util/concurrent/ConcurrentLinkedQueue.html#remove(java.lang.Object))([Object](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/lang/Object.html) o)
从队列中移除指定元素的单个实例(如果存在)

``` java
public static void main(String[] args) {
    ConcurrentLinkedQueue queue = new ConcurrentLinkedQueue();
    queue.offer("hhh");
    System.out.println("offer 后, 队列是否空? " + queue.isEmpty());
    System.out.println("从队列中 remove 已存在元素: " + queue.remove("xxx"));
    System.out.println("从队列中 remove 不存在元素: " + queue.remove("123"));
    System.out.println("remove 后, 队列是否空? " + queue.isEmpty());
    }
```

remove 一个元素, 会返回 true, remove 不存在元素, 返回 false.

执行结果:

> offer 后, 队列是否空? false
从队列中 remove 已存在元素: true
从队列中 remove 不存在元素: false
remove 后, 队列是否空? true


## size or isEmpty

[size](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/util/concurrent/ConcurrentLinkedQueue.html#size())()
返回此队列中的元素数量

__注意:__
> 如果此队列包含的元素大于 Integer.MAX_VALUE, 则返回 Integer.MAX_VALUE. 需要小心的是, 与大多数 collection 不同, 此方法不是一个固定时间操作. 由于这些队列的异步特性, 确定当前的元素数需要进行一次花费 O(n) 时间的遍历.
所以在需要判断队列是否为空时, 尽量不要用 queue.size()>0, 而是用 !queue.isEmpty()

比较 size() 和 isEmpty() 效率的实例:
场景: 10000个人去饭店吃饭, 10张桌子, 分别比较 size() 和 isEmpty() 的耗时

``` java
public class Test01ConcurrentLinkedQueue {
    public static void main(String[] args) throws InterruptedException {
        int peopleNum = 10000;//吃饭人数
        int tableNum = 10;//饭桌数量

        ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<>();
        CountDownLatch count = new CountDownLatch(tableNum);//计数器

        //将吃饭人数放入队列（吃饭的人进行排队）
        for(int i=1;i<=peopleNum;i++){
            queue.offer("消费者_" + i);
        }
        //执行10个线程从队列取出元素（10个桌子开始供饭）
        System.out.println("-----------------------------------开饭了-----------------------------------");
        long start = System.currentTimeMillis();
        ExecutorService executorService = Executors.newFixedThreadPool(tableNum);
        for(int i=0;i<tableNum;i++) {
            executorService.submit(new Dinner("00" + (i+1), queue, count));
        }
        //计数器等待，知道队列为空（所有人吃完）
        count.await();
        long time = System.currentTimeMillis() - start;
        System.out.println("-----------------------------------所有人已经吃完-----------------------------------");
        System.out.println("共耗时：" + time);
        //停止线程池
        executorService.shutdown();
    }

    private static class Dinner implements Runnable{
        private String name;
        private ConcurrentLinkedQueue<String> queue;
        private CountDownLatch count;

        public Dinner(String name, ConcurrentLinkedQueue<String> queue, CountDownLatch count) {
            this.name = name;
            this.queue = queue;
            this.count = count;
        }

        @Override
        public void run() {
            //while (queue.size() > 0){
            while (!queue.isEmpty()){
                //从队列取出一个元素 排队的人少一个
                System.out.println("【" +queue.poll() + "】----已吃完...， 饭桌编号：" + name);
            }
            count.countDown();//计数器-1
        }
    }
}
```

执行结果:
> 使用 size 耗时: 757ms
![](https://ws3.sinaimg.cn/large/006tNbRwgy1fyepm8ds8ij30g0049t91.jpg)
使用 isEmpty 耗时: 210ms
![](https://ws1.sinaimg.cn/large/006tNbRwgy1fyepmvpgvdj30iw049dg5.jpg)

当数据越大, 这种耗时差距越明显. 所以这种判断用 isEmpty 更加合理.


## contains

[contains](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/util/concurrent/ConcurrentLinkedQueue.html#contains(java.lang.Object))([Object](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/lang/Object.html) o)
如果此列队包含指定元素, 则返回 true

``` java
public static void main(String[] args) throws InterruptedException {
    ConcurrentLinkedQueue queue = new ConcurrentLinkedQueue();
    queue.offer("123");
    System.out.println(queue.contains("123"));
    System.out.println(queue.contains("234"));
}
```

执行结果:
> ![](https://ws3.sinaimg.cn/large/006tNbRwgy1fyeprtdib4j306z01at8h.jpg)


## toArray

[toArray](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/util/concurrent/ConcurrentLinkedQueue.html#toArray())
返回以恰当顺序包含此队列所有元素的数组

[toArray](T[] a)
返回以恰当顺序包含此队列所有元素的数组, 返回数组的运行时类型是指数组的运行时类型
``` java
public static void main(String[] args) throws InterruptedException {
    ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<String>();
    queue.offer("123");
    queue.offer("234");
    Object[] objects = queue.toArray();
    System.out.println(objects[0] + ", " + objects[1]);

    //将数据存储到指定数组
    String[] strs = new String[2];
    queue.toArray(strs);
    System.out.println(strs[0] + ", " + strs[1]);
}
```

执行结果:
> ![](https://ws1.sinaimg.cn/large/006tNbRwgy1fyepuyo52ej305e01kjr6.jpg)


## iterator

[ierator](http://tool.oschina.net/uploads/apidocs/jdk-zh/java/util/concurrent/ConcurrentLinkedQueue.html#iterator())()
返回在此队列元素上以恰当顺序进行迭代的迭代器

``` java
public static void main(String[] args) throws InterruptedException {
    ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<String>();
    queue.offer("123");
    queue.offer("234");
    Iterator<String> iterator = queue.iterator();
    while (iterator.hasNext()){
        System.out.println(iterator.next());
    }
}
```

![](https://ws1.sinaimg.cn/large/006tNbRwgy1fyepyiyx30j305601f3ya.jpg)