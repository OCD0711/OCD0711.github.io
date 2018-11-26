---
title: Python 列表
date: 2017-11-11  2
author: "OCD"
category:
    - Programming
tags:
  - Python
  - Develop
---
使用 `[]` 表示列表

<!-- more -->

## 2.1. Example -- bicycles.py

```python
bicycles = ['trek', 'cannondale', 'redline', 'specialized'] 
print( bicycles)
```
__The output is__ `['trek', 'cannondale', 'redline', 'specialized']`

**输出元素** --> `print(bicycles[0])` to print `trek`

# START FROM 0!!!!!

注: 使用 `bicycle[-1]` 以取得 bicycle 中的倒数第一个元素
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;`bicycle[-2]` 以取得 bicycle 中的倒数第二个元素
&ensp;&ensp;&ensp;&ensp;·······
&ensp;&ensp;&ensp;&ensp;依次类推
<br />    

## 2.2. 改变一个元素的值 Example --> change 'trek' to 'test'

```python
bicycles[0] = 'test'
```
<br />

## 2.3. 使用append() 将元素添加到列表末尾
```python
bicycles.append('test_end')
```

one more example here

```python
motorbicycles = []
motorbicycles.append('cannondale')
motorbicycles.append('redline')
motorbicycles.append('specialized')
print(motorbicycles)
```

###### Output `['cannondale', 'reline', 'specialized']`
<br />

## 2.4. 使用 insert() 向列表添加元素
注: motorbicycles 与上文相同.
```python
motorbicycles.insert(0, 'ducati')
print(motorbicycles)
```

###### Output `['ducati', 'cannondale', 'realine', 'specialized']`
<br />

## 2.5. 删除语句

### 2.5.1 使用 del 语句
```python
del motorbicycles[0]
print(motorbicycles)
```
###### Output `['cannondale', 'realine', 'specialized']`

### 2.5.2 使用 pop() 删除元素
pop()可删除列表末尾的元素，并让你能够接着使用它。
```python
motorcycles = ['honda', 'yamaha', 'suzuki']
print(motorcycles)
popped_motorcycle = motorcycles.pop()
print(motorcycles)
print(popped_motorcycle)
```

###### Output:
`['honda', 'yamaha', 'suzuki']`
`['honda', 'yamaha']`
`suzuki`
使用 pop(__int__) 来确定弹出位置 `motorcycles.pop(0)` 为弹出第0(1)个位置的 _honda_

### 2.5.3 使用 remove 按值删除元素
` motorcycles.remove('honda')` 会删除 __honda__


## 2.6 使用 sort() 对列表进行永久排序

 cars.py
```python
cars = ['bmw', 'audi', 'toyota', 'subaru']
cars.sort()
print(cars)
cars.sort(reverse=True)
print(cars)
```

###### output: 

`['audi', 'bmw', 'subaru', 'toyota']`

`['toyota', 'subaru', 'bmw', 'audi']`

## 2.7 使用 sorted() 对列表进行临时排序

```python
cars = ['bmw', 'audi', 'toyota', 'subaru']
#cars.sort()
print(cars)
print(sorted(cars))
print(cars)
print(sorted(cars, reverse=True))
```
###### output:
`['bmw', 'audi', 'toyota', 'subaru']`

`['audi', 'bmw', 'subaru', 'toyota']`

`['bmw', 'audi', 'toyota', 'subaru']`

`['toyota', 'subaru', 'bmw', 'audi']`

## 2.8 使用 len() 确定列表长度

```python
len(cars)
```

## 2.9 遍历整个列表

for 循环
                   
```python
magicians = ['alice', 'david', 'carolina']
for magician in magicians:
  print(magician)
```
###### 每次从列表取名字, 存在 `magician` 中并打印 (`print`)

每个缩进的代码行都是循环的一部分，且将针对列表中的每个值都执行一次。因此，可对列表中的每个值执行任意次数的操作。

## 2.10 创建数值列表

### 2.10.1 使用 range()
```python 
for value in range(1,5)
  print(value)
```

###### Output:
`1`
`2`
`3`
`4`

在这个示例 中，range()只是打印数字1~ 4， 这是你在编程语言中经常看到的差一行为的结果。函数 range() 让 Python 从你指定的第一个值开始 数，并在到达你 指定的第二个值后停止，因此输出不包含 第二个值（这里 为 5）。


__E.g: To print 1 2 3 4 5, use:__
 ```python
 for value in range(1, 6)
  print(value)
```

### 2.10.2 使用 list() 和 range() 建表
```python
numbers = list(range(1,6))
print(numbers)
# 设置步长
even_number = list(range(2,11,2))
print(even_number)
```
###### Output:
`[1, 2, 3, 4, 5]`
`[2, 4, 6, 8, 10]`

_平方数组_
```python
squares = []
for value in range(1, 11):
  squares.append(value**2)
  
print(squares)
```

## 2.11 对数字列表进行简单计算
```python
digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
print(min(digits))
print(max(digits))
print(sum(digits))
```
###### Output:
`0`
`9`
`45`
### 2.11.1列表解析
```python
squares = [value**2 for value in range(1, 11)]
print(squares)
```
###### Output: `[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]`

## 2.12 切片
```python
players = ['charles', 'martina', 'michael', 'florence', 'eli']
print(players[0:3]
```
###### Output: `['charles', 'martina', 'michael']`

### 遍历切片
处理 列表 的 部分 元素—— Python 称之为 切片。

```python
for player in players[:3]:
    print(player.title())
```

## 2.13 复制列表
_foods.py_
```python
my_foods = ['pizza', 'falafel', 'carrot cake']
friends_foods = my_foods[:]

print("My favorite foods are:")
print(my_foods)

print("\nMy friend's favorite foods are:")
print(friend_foods)
```
这实际上产生了2个列表，他们是独立的。E.g:
```python
friends_foods.append('ice cream')
print(my_foods)
print(friends_foods)
```
此代码中输出并不相同，可见相互独立。

__需要用切片复制列表，否则不能得到两个列表__
```python
my_foods = ['pizza', 'falafel', 'carrot cake']

friend_foods = my_foods

my_foods.append('cannoli')
friend_food.append('ice cream')

print(my_foods)
print(friend_food)
```
实际上, 输出是一样的

## 2.14 元组
Python 将不能修改的值称为不可变的，而不可变的列表被称为元组。

### 2.14.1 定义元组
使用圆括号标识

_dimensions.py_
```python
dimensions = (200, 50)
print(dimensions[0])
print(dimensions[1])
```
###### Output:
`200`
`50`

值不能被改变:
`dimensions[0] = 50`
###### Output:
```
Traceback (most recent call last): File "dimensions.py", line 3, in < module> dimensions[ 0] = 250 TypeError: 'tuple' object does not support item assignment
```
### 遍历元组中所有值
```python
dimensions = (50, 200)
for dimension in dimensions:
    print(dimension)
```
###### Output:
`200`
`50`

