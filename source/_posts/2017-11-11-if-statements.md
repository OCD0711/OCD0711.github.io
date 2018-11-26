---
title: If Statement
date: 2017-11-11 2
author: "OCD"
category:
    - Programming
tags: 
    - Python
    - Develop
---
 An class for `if` STATEMENT
 
<!-- more -->

## 3.1 An simple example
_cars.py_
```python
cars = ['audi', 'bmw', 'subaru', 'toyota']

for car in cars:
    if car == 'bmw':
        print(car.upper())
    else:
        print(car.title())
```
###### Output: 
`Audi`

`BMW`

`Subaru`

`Toyota`

## 3.2 条件测试
### 3.2.1 检查是否相等
`car == 'bmw'` will output like `True` or `False`
The following code will always be true
```python
car = 'audi'
car == 'audi'
```
###### Output: `True`

#### 3.2.1.1 检查是否相等时不考虑大小写
__Use `lower()` or `upper`__

E.g:
```python
car = 'Audi'
print(car.lower() == 'audi')
print(car)
```
###### Output: 
`True`
`Audi`
--> 操作不影响存储在变量 `car` 中的值

### 3.2.2 检查是否不相等
__Use `!=`__

E.g: toppings.py
```python
requested_topping = 'mushrooms'

if requested_topping != 'anchovies':
    print("Hold the anchovies!")
```
###### Output: `Hold the anchovies!`

### 3.2.3 比较数字
__also use `==` and `!=`__

E.g: magic_number.py
```python
answer = 17

if answer != 42:
    print("This is not the correct answer. please try again!")
```
###### Output: `This is not the correct answer. please try again!`

### 3.2.4 检查多个条件
__Use `and` and `or`__

#### 3.2.4.1 使用 `and` 检查多个条件
E.g:
```python
age_0 = 22
age_1 = 18
print(age_0 >= 21 and age_1 >= 21)  # False
age_1 = 22
print(age_0 >= 21 and age_1 >= 21)  # True
```
#### 3.2.4.2 使用 `or` 检查多个条件
__同上__

### 3.2.5 检查特定值是否在表中
__使用关键词 `in`__

E.g:
```python
requested_toppings = ['mushrooms', 'onions', 'pineapple']
print('mushrooms' in requested_toppings)    # True
print('pepperoni' in requested_toppings)    # false
```

### 3.2.6 检查特定元素不在列表中
__使用关键字 `not in`__

E.g: banned_users.py
```python
banned_users = ['andrew', 'carolina', david']
user = 'marie'

if user not in banned_users:
    print(user.title() + ", you can post a response if you wish.")
```
###### Output:
`Marie, you can post a response if you wish`

### 3.2.7 bool expression
__条件测试的别名, 要么为 `True` 要么为 `False`__

E.g:
```python
game_active = True
can_edit = False
```

## 3.3 If语句
### 3.3.1 简单的 if 语句
__一个测试一个操作__

E.g:
```python
if condition_test:
    do something
```
```python
age = 19
if age >= 18:
    print("You are old enough to vote!")
    print("Have you registered to vote yet?")
```
this will print two lines
###### Output:
`You are old enough to vote!`
`Have you registered to vote yet?`

if age is less than 18, the program will give no output.

### 3.3.2 if-else 语句
__`else` 在if不成立时执行__

E.g:
```python
age = 17
if age >= 18:
    print("You are old enough to vote")
    print("Have you registered to vote yet?")
else:
    print("Sorry, you are too young to vote.")
    print("Please register to cote as soon as you turn 18!")
```
###### Output:
`Sorry, you are too young to vote.`
`Please register to cote as soon as you turn 18!`

### 3.3.3 if-elif-else 结构
__检查超过两个条件的情形__

```python
age = 12

if age < 4:
    print("Your admission cost is $0")
elif age < 18
    print("Your admission cost is $5")
else 
    print("Your admission cost is $10")
```
###### Output: `Your admission cost is $5`

### 3.3.4 使用多个 `elif` 代码块

### 3.3.5 省略 `else` 代码块

### 3.3.6 测试多个条件

## 3.4 使用 `if` 语句处理列表

### 3.4.1 检查特殊元素
E.g: toppings.py
```python
requested_toppings = ['mushrooms', 'green_peppers', extra cheese']

for requested_topping in requested_toppings:
    print("Adding " + requested_topping + '.')
    
print("\nFinished making your pizza")
```
###### Output
`Adding mushrooms.`
`Adding green_peppers.`
`Adding extra cheese.`

`Finished making your pizza`

A polished version
```python
requested_toppings = ['mushrooms', 'green_peppers', extra cheese']

for requested_topping in requested_toppings:
    if requested_topping == 'green_peppers':
        print(“Sorry we are out of green peppers right now.")
    else: 
        print("Adding " + requested_topping + '.')
    
print("\nFinished making your pizza")
```
###### Output:
`Adding mushrooms`
`Sorry we are out of green peppers right now.`
`Adding extra cheese`

`Finished making your pizza`

### 3.4.2 确定列表不是空的
__使用 `for`__

E.g: 
```python
requested_toppings = []

if requested_toppings:
    for requested_topping in requested_toppings:
        print("Adding " + requested_topping + '.')
    print("Finished making your pizza")
else 
    print("Are you sure you want a plain pizza?")
```

###### Output:
`Are you sure you want a plain pizza?`

### 3.4.3 使用多个列表
Skipped






