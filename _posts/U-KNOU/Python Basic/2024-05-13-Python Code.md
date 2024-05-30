---
title: "[U-KNOU] Python Basic Code"
description: "[U-KNOU] Python Basic Code"
date: 2024-05-13
categories: [ U-KNOU, Python Basic ]
tags: [ U-KNOU, Python Basic ]
---

## 원뿔의 부피 구하기( range(), zip() )

```python
# 반지름과 높이가 (10, 1), (20, 5), (30, 14)인 원뿔의 부피를 구해라

radius_list = range(10, 31, 10)
height_list = [1, 5, 14]

# zip(): 여러 리스트의 값을 한꺼번에 꺼내오기 위해 사용
for r, h in zip(radius_list, height_list):
    print(1/3 * 3.14 * r**2 * h)
```

<br/>

```python
# 함수
def rtn_cone_vol_surf(r, h):
    if r > 0 and h > 0:
        vol = 1/3 * 3.14 * r**2 * h
        surf = 3.14 * r**2 + 3.14 * r * h
        return vol, surf                             # 리턴값 두 개 반환
    else:
        print("반지름과 높이 값에 양수를 입력하세요")

vol1, surf1 = rtn_cone_vol_surf(50, 100)
print(vol1)
print(surf1)
```

## 구구단 표 출력하기

```python
print(format("구구단표", ">20s"))

# column
print("  |" ,end="")
for c in range(1, 10):
    print("  ", c, end="")

# new a row
print()
print("-----------------------------------------")

# rows
for i in range(1,10):
    print(i, "|" ,end="")
    for j in range(1,10):
        print(format(i * j, ">4d"), end="") 
    print()
```

## 숫자 역순 함수 출력 프로그램

```python
# mine
def func(str):
    try: 
        int(str)
    except:
        print("not a number")
    else:
        return int("".join(reversed(str)))

n = input("input number ")
func(n)    

# teacher
def reverse_numer(num):
    while num != 0:
        digit = num % 10   # 나머지
        num = num // 10    # 몫: 1234 // 10 == 123
        print(digit, end="")

n = int(input("input number : "))
reverse_numer(n)
```

## 정렬 프로그램

```python
# mine
try:
    a = int(input("first number: "))
    b = int(input("second number: "))
    c = int(input("third number: "))
except:
    print("not a number")
else:
    sortedNumbers = sorted([a,b,c])
    for i in range(0,len(sortedNumbers)):
        print(sortedNumbers[i], end=",")

# teacher
def sorting(a, b, c):
    if a > b:
        a, b = b, a
    if a > c:
        a, c = c, a
    if b > c:
        b, c = c, b
    return a, b, c

x = int(input("first number: "))
y = int(input("second number: "))
z = int(input("third number: "))

print(sorting(x, y, z))
```

## 파라미터 가변값

```python
def var_sum_avg(*numbers):
    sum = 0
    count = 0
    
    for i in numbers:
        sum += i
        count += 1
    return sum, sum/count

print(var_sum_avg(10,20,30,40))
```

## 원뿔 클래스 작성

```python
import math

pi = math.pi

class Cone:
    
    def __init__(self, radius = 20, height = 30):
        if radius > 0 and height > 0:
            self.__r = radius       # __r: private
            self.__h = height       # __h: private
    
    def get_vol(self):
        return 1/3 * pi * self.__r**2 * self.__h
    
    def get_surf(self):
        return pi * self.__r**2 + pi * self.__r * self.__h
    
    def get_radius(self):
        return self.__r
    
    def set_radius(self, r):
        if (r > 0):
            self.__r = r
    

unit_cone = Cone()
big_cone = Cone(50, 100)

print("기본 부피 :",unit_cone.get_vol())
print("기본 겉넓이 :",unit_cone.get_surf())

print("큰 원뿔 부피 :",big_cone.get_vol())
print("큰 원뿔 겉넓이 :",big_cone.get_surf())
```

## 로또 추첨 프로그램

```python
import random 

# 사용자 번호 목록
guess_str = input("1~45 번호 6개를 쉼표로 분리하여 입력하세요: ").split(",")
guess_list = list()

for i in guess_str:
    guess_list.append(int(i))
    
# 프로그램 번호 목록
lotto_list = random.sample(range(1, 46, 1), 6) # sample: 특정 번호사이에서 특정 개수를 가져와라
print("추첨 번호는", lotto_list, "입니다")

print("입력하신 번호는", guess_list, "입니다")

hit_count = 0

for guess in guess_list:
    if guess in lotto_list:
        hit_count += 1

if hit_count < 6:
    print(str(hit_count) + "개 맞혔습니다.")
elif hit_count == 6:
    print("당첨되었습니다")
```

## 스무고개 프로그램

```python
import random

hit_number = random.randint(1, 1001)

guess_count_list = range(1,21,1)
passfail = False

for guess_count in guess_count_list:
    
    guess = int(input("숫자를 맞혀보세요.(" + str(guess_count) + "번째 시도)"))

    if hit_number == guess:
        passfail = True
        break
    elif hit_number > guess:
        print(str(guess) + "보다 큽니다")
    else:
        print(str(guess) + "보다 작습니다")
    
if passfail == True:
    print("맞췄습니다. 축하합니다")
else:
    print("모든 기회를 다 사용했습니다.")
```

## 소수 찾기 프로그램

```python
import time

start_time = time.time()

def is_prime(x):
    for i in range(2,x):
        if x % i == 0:
            return False
    return True

prime_count = 0

for i in range(2, 5001):
    if is_prime(i):
        prime_count += 1
        print(i, end = ", ")
    
end_time = time.time()

print("\n",end_time - start_time, "초 실행했습니다.")   
```

## Read File

```python
# read

filePath = "C:\\jupyterNotebook\\Khan.txt"
f = open(filePath, "r", encoding='UTF8')

for line in f.readlines():
    print(line.strip())

f.close()
```

## Write File (append)

```python
# write

filePath = "C:\\jupyterNotebook\\Khan.txt"
f = open(filePath, "a", encoding='UTF8')

f.write("\n")
f.write(format("-칭기스 칸-", ">50s"))

f.close()
```

## 파일 내 사용된 단어 횟수 출력하기

```python
# "hamlet_by_Shakespeare.txt" 파일에 포함된 단어와 각 단어의 출현 횟수를 출력하는 프로그램을 작성하시오

filePath = "C:\\jupyterNotebook\\hamlet_by_Shakespeare.txt"

f = open(filePath, "r", encoding='UTF8')

word_dict = dict()

for line in f.readlines():
    for word in line.strip().split():                # split(): 공백 단위로 끊어낸다
        word = word.strip(" ..:?[]!\"\':-").lower()  # 특수문자 제거
        
        if word_dict.get(word) is not None:
            count = word_dict[word]
        else:
            count = 0
        
        word_dict[word] = count + 1
        
# 추가된 코드
word_r_dict = {v:k for (k, v) in word_dict.items()}        # 키와 값을 뒤바꿈
word_dict = {v:k for (k,v) in sorted(word_r_dict.items(), reverse=True)}
    
    
for key in word_dict:
    print("[" + key + "]", str(word_dict[key])+"회")
        
f.close()
```