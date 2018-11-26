---
title: Python 字典
date: 2017-11-19
author: "OCD"
category:
    - Programming
tags: 
    - Python
    - Develop
---
在 Python 中, 字典是一系列 `键值对`, 每个`键`都与一个`值`相关联, 可以使用键来访问相关的值.
<!-- more -->

## 4.0 对 Example 解释
E.g:
```python
alien_0 = {'color': 'green', 'points': 5}

alien_0 = {'color': 'green', 'points': 5}
print(alien_0['color']
print(alien_0['points']
```
###### Output:
```
green
5
```

## 4.1 使用字典
事实上,可以将任何 Python 对象用作字典的值.

在 Python 中, 字典用放在花括号 `{}` 的一系列 键--值 对表示

### 4.1.1 访问字典中的值
E.g:
```python
alien_0 = {'color': 'green'}
print(alien_0['color']
```
###### Output: 
```
green
```
### 4.1.2 添加键值对
可依次指定字典名、用方括号括起的键和相关联的值
E.g:
```python
alien_0 = {'color': 'green', 'points': 5}
print(alien_0)

alien_0['x_position'] = 0
alien_0['y_position'] = 25
print(alien_0)
```
###### Output
```
{'color': 'green', 'points': 5}
{'color': 'green', 'points': 5, 'x_position': 0, 'y_position': 25}
```
### 4.1.3 先创建一个空字典
E.g:
```python
alien_0  = {}
```

### 4.1.4 修改字典中的值
E.g:
```python
alien_0 = {'color': 'green'}
print(alien_0['color'])

alien_0['color'] = 'yellow'
print(alien_0['color'])
```
###### Output:
```
green
yellow
```

### 4.1.5 删除以键值对
使用 `del` 语句
    
E.g:
```python
alien_0 = {'color': 'green', 'points': 5}
print(alien_0)

del alien_0['points']
print(alien_0)
```
###### Output: 
```
{'color': 'green', 'points': 5}
{'color': 'green'}
```

### 4.2.6: 由类似对象构成的字典
E.g:
```python:
favourite_languages = {
    'jen' = 'python',
    'sarah' = 'c'
    'edward' = 'ruby'
    'phil' = 'python',
}
```

## 4.3 遍历字典

### 4.3.1: 遍历所有键值对
E.g:
```python
user_0 = {
    'username':'efermi',
    'first':'enrico',
    'last':'fermi',
}

for key,value in user_0.items():
    print("\nKey: " + key)
    print("Value: " + value)
```
###### Output
```

Key: username
Value: efermi

Key: first
Value: enrico

Key: last
Value: fermi
```

`for k, v in user_0.items()`
for 语句的第二部分包含字典名和方法 `items()`, 它返回一个 键--值 对列表.

###### 注: 即使遍历字典时, 返回顺序也于存储顺序不同.

### 4.3.2 遍历字典中的所有键
使用 `keys()`
E.g:
```python
favourite_languages = {
    'jen': 'python',
    'sarah': 'c',
    'edward': 'ruby',
    'phil': 'python',
}

for name in favourite_languages.keys():
    print(name.title())
```
###### Output:
```
Jen
Sarah
Edward
Phil
```
遍历字典时, 会默认遍历所有的键,
so:
` for name in favourite_languages.keys()` == `for names in foavourite_languages`

#### 4.3.2.1 按顺序遍历字典中的所有键
用 sorted() 创建按特定顺序排列的键的列表的副本
E.g:
```python
for name in sorted(favourite_languages.keys()):
```

### 4.3.3 遍历字典中的所有值
使用 value() 
E.g: 
```python
for language in favourite_languages.values():
``` 
注: 该方法遍历所有值, 可能导致重复
为剔除重复项, 可使用集合 (set), 集合类似于列表, 但每个元素都是独一无二的.
```python
for language in set(favourite_languages.values()):
```

## 4.4 嵌套
### 4.4.1 字典列表
E.g: ( aliens.py )
```python
alien_0 = {'color': 'green', 'points': 5}
alien_1 = {'color': 'yellow', 'points': 10}
alien_2 = {'color': 'red', 'points': 15}

aliens = [alien_0, alien_1, alien_2]

for alien in aliens:
    print(alien)
```
###### Output:
```
{'color': 'green', 'points': 5}
{'color': 'yellow', 'points': 10}
{'color': 'red', 'points': 15}
```

E.g_2:
```python
aliens = []

for alien_number in range(30):
    new_alien = {'color': 'green', 'points': 5, 'speed': 'slow'}
    aliens.append(new_alien)
    
for alien in aliens[0:3]:
    if alien['color'] == 'green':
        alien['color'] = 'yellow'
        alien['points'] = 10
        alien['speed'] = 'medium'
for alien in aliens[:5]:
    print(alien)
print('...')

print('Total number of aliens: ' + str(len(aliens)))
```

###### Output: 
```
{'color': 'yellow', 'points': 10, 'speed': 'medium'}
{'color': 'yellow', 'points': 10, 'speed': 'medium'}
{'color': 'yellow', 'points': 10, 'speed': 'medium'}
{'color': 'green', 'points': 5, 'speed': 'slow'}
{'color': 'green', 'points': 5, 'speed': 'slow'}
...
```

### 4.4.2 在字典中存储列表
E.g: ( pizza.py )
```python
pizza = {
    'crust': 'thick',
    'toppings': ['mushrooms', 'extra cheese']
    }
    
print('You ordered a ' + pizza['crust'] + '-crust pizza ' +
            'with the following toppings: ')
            
for topping in pizza['toppings']:
    print('\t' + topping) 
```

###### Output:
```
You ordered a thick-crust pizza with the following toppings: 
	mushrooms
	extra cheese
```

E.g_2:
```python
favourite_languages = {
    'jen': ['python', 'ruby'],
    'sarah': ['c'],
    'edward': ['ruby', 'go'],
    'phil': ['python', 'haskell'],
}

for name, languages in favourite_languages.items():
    print('\n' + name.title() + "'s favourite languages are:")
    
    for language in languages:
        print("\t" + language.title())
```

###### Output:
```
Jen's favourite languages are:
	Python
	Ruby

Sarah's favourite languages are:
	C

Edward's favourite languages are:
	Ruby
	Go

Phil's favourite languages are:
	Python
	Haskell
```

### 4.4.3 在字典中存储字典
E.g: ( many_users.py )
```python
users = {
    'aesinstein': {
        'first': 'albert',
        'last': 'einstein',
        'location': 'princeton',
        },
        
    'mcurie': {
        'first': 'marie',
        'last': 'curie',
        'location': 'paris',
        },
        
    }
    
for username, user_info in users.items():
    print('\nUsername: ' + username)
    full_name = user_info['first'] + ' ' +  user_info['last']
    location = user_info['location']
     
    print('\tFull name: ' + full_name.title())
    print('\tLocation: ' + location.title())
  ```

###### Output:
```
Username: aesinstein
	Full name: Albert Einstein
	Location: Princeton

Username: mcurie
	Full name: Marie Curie
	Location: Paris
```

