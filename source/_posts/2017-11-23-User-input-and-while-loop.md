---
title: 用户输入和 while 循环
author: "OCD"
date: 2017-11-23 1
category:
    - Programming
tags:
    - Python
    - Develop
---
使用 input() 处理用户输入

<!-- more -->

## 7.1 函数 `input()` 工作原理
__E.g:__
```python
message = input("Tell me something, and I will repeat it back to you: ")
print(message)
```
###### Output:
```
Tell me something, and I will repeat it back to you: 
Hello, Everyone!
Hello, Everyone!
```

### 7.1.1 编写清晰的程序
没当你编写函数 `input()` 时, 都应指定清晰而易于明白的提示如下所示:
__E.g:__
```python
name = input("Please enter your name")
print("Hello, " + name + "!")  
```
###### Output:
```
Please enter your name: Eric
Hello, Eric!
```

### 7.1.2 使用 int() 来获取数值输入
使用函数 `input()` 时, Python 会将用户输入解读为字符串, 为解决此问题, 可使用函数 `int()`

__E.g:__
```python:
age = input("How old are you?")
age = int(age)
```

### 7.1.3 求模运算符 `%`
__E.g:__ even_or_odd.py
```python
number = input("Enter a number, and I'll tell you whether it is even or odd: ")
number = int(number)

if number % 2 == 0:
    print("\nThe number " + str(number) + " is even.")
else:
    print("\nThe number " + str(number) + " is odd.")
```

###### Output:
```
Enter a number, and I'll tell you whether it is even or odd: 43

The number 43 is odd
```

## 7.2 `while` 循环简介
### 7.2.1 使用 `while` 循环
__E.g:__ counting.py
```python
current_number = 1
while current_number <= 5:
    print(current_number)
    current_number += 1
```
###### Output:
```
1
2
3
4
5
```
### 7.2.2 让用户选择何时退出
we can define a variable and evaluate it when entering `while`
__E.g:__ parrot.py
```python
prompt = "\nTell me something, and I will repeat it back to you: "
prompt += "\nEnter 'quit' to end the program: "
message = ""

while message != 'quit':
    message = input(prompt)
    if message != 'quit':
        print(message)
```

###### Output:
```
Tell me something, and I will repeat it back to you:
Enter 'quit' to end the program: hello
hello

Tell me something, and I will repeat it back to you:
Enter 'quit' to end the program: 1
1

Tell me something, and I will repeat it back to you:
Enter 'quit' to end the program: quit
```

### 7.2.3 使用标志
__E.g:__  improved_parrot.py
```python
prompt = "\nTell me something, and I will repeat it back to you: "
prompt += "\nEnter 'quit' to end the program: "
message = ""

active = True
while active == True:
    message = input(prompt)
    if message == 'quit':
        active = False
    else:
        print(message)
```

###### Output: `same as above`

### 7.2.4 Use `break` to quit a loop
__E.g:__ second_inproved_parrot.py
```python
prompt = "\nTell me something, and I will repeat it back to you: "
prompt += "\nEnter 'quit' to end the program: "
message = ""

while True:
    message = input(prompt)
    if message == 'quit':
        break
    else:
        print(message)
```
注: 在任何循环中都可使用 break

### 7.2.5 Use `continue`
__E.g:__ counting.py
```python
current_number = 0
while current_number < 10:
    current_number += 1
    if current_number %2 == 0:
        continue
        
    print(current_number)
```
###### Output:
```
1
3
5
7
9
```
### 7.2.6 避免无限循环

## 7.3 使用 `while` 处理列表和字典
### 7.3.1 在列表中移动元素
__E.g:__ confirmed_users.py
```python
unconfirmed_users = ['alice', 'brian', 'candace']
confirmed_users = []

while unconfirmed_users:
    current_user = unconfirmed_users.pop()
    
    print("Verifying user: " + current_user.title())
    confirmed_users.append(current_user)
    
print("\nThe following users have been confirmed: ")
for confirmed_user in confirmed_users:
    print(confirmed_user.title())
``` 

###### Output:
```
Verifying user: Candace
Verifying user: Brian
Verifying user: Alice

The following users have been confirmed: 
Candace
Brian
Alice
```

### 7.3.2 删除包含特定值的所有列表元素
在第二章中, 我们使用函数 `remove()` 来删除列表中的特定值, 现在要删除多个相同元素:
__E.g:__ pets.py
```python
pets = ['dog', 'cat', 'dog', 'goldfish', 'cat', 'rabbit', 'cat']
print(pets)

while 'cat' in pets:
    pets.remove('cat')
    
print(pets)
```

###### Output
```
['dog', 'cat', 'dog', 'goldfish', 'cat', 'rabbit', 'cat']
['dog', 'dog', 'goldfish', 'rabbit']
```

### 7.3.3 使用用户输入填充字典
__E.g:__ mountain_poll.py
```python
responses = {}

polling_active = True

while polling_active:
    name = input("\nWhat is your name? ")
    response = input("Which mountain would you like to climb someday? ")
    
    responses[name] = response
    
    repeat = input("Would you like to let another person respond? (yes/no)")
    if repeat == 'no':
        polling_active = False
        
print("\n--- Poll Result ---\n")
for name, mountain in responses.items():
    print(name.title() + " would like to climb " + mountain.title() + ".")
```

###### Output:
```
What is your name? bbn
Which mountain would you like to climb someday? a
Would you like to let another person respond? (yes/no)no

--- Poll Result ---

Bbn would like to climb a.
```




