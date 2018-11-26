---
title: Algorithm Analysis
author: "OCD"
date: 2017-11-30 1
mathjax: true
category:
    - Programming
tags: 
    - C
    - Data Structure
    - Develop
---

Showing two possible Algorithms:

<!-- more -->
## 1. Maximum Subsequence Sum
### A. O( N*logN \)
This example uses a `divide and conquer` strategy
__Example__:

```c
//
//  main.c
//  Temp
//
//  Created by clfbbn on 2017/11/26.
//  Copyright © 2017年 clfbbn. All rights reserved.
//

#include <stdio.h>
int Max3(int a, int b, int c) {
    int max;
    if (a > b) {
        max = a;
    } else{
        max = b;
    }
    if (max < c) {
        max = c;
    }
    return max;
}
static int MaxSubSum( const int A[8], int Left, int Right) {
    int MaxLeftSum, MaxRightSum;
    int MaxLeftBroaderSum, MaxRightBroaderSum;
    int LeftBroaderSum, RightBroaderSum;
    int Center, i;
    
    if (Left == Right) {
        if (A[ Left ] > 0) {
            return A[ Left ];
        } else{
            return 0;
        }
    }
    
    Center = (Left + Right) / 2;
    MaxLeftSum = MaxSubSum(A, Left, Center);
    MaxRightSum = MaxSubSum(A, Center + 1, Right);
    
    MaxLeftBroaderSum = 0; MaxRightBroaderSum = 0;
    LeftBroaderSum = 0; RightBroaderSum = 0;
    
    for (i = Center; i >= Left; --i) {
        LeftBroaderSum += A[i];
        if (LeftBroaderSum > MaxLeftBroaderSum) {
            MaxLeftBroaderSum = LeftBroaderSum;
        }
    }
    
    for (i = Center + 1; i <= Right; ++i) {
        RightBroaderSum += A[i];
        if (RightBroaderSum > MaxRightBroaderSum) {
            MaxRightBroaderSum = RightBroaderSum;
        }
    }
    return Max3( MaxLeftSum, MaxRightSum, MaxRightBroaderSum + MaxLeftBroaderSum);
}

int MaxSubsequenceSum(const int A[], int N){
    return MaxSubSum(A, 0, N - 1);
}
int main() {
    int array[8] = {4, -3, 5, -2, -1, 2, 6, -2,};
    printf("%d\n", MaxSubsequenceSum(array, 8));
    
    return 0;
}
```

### B. O(N)
```c
int MaxSunsequenceSum_New( const int A[], int N) {
    int ThisSum, MaxSum, j;
    
    ThisSum = MaxSum = 0;
    
    for (j = 0; j < N; j++) {
        ThisSum += A[j];
        if (ThisSum < 0) {
            ThisSum = 0;
        }
        if (ThisSum > MaxSum) {
            MaxSum = ThisSum;
        }
    }
    return MaxSum;
}
```

## 2. Binary Search ( O(logN) )

```c
#define ElementType int
#include <stdio.h>


int BinarySearch(const ElementType A[], int N, ElementType x) {
    int Low, High, Mid;
    
    Low = 0;
    High = N - 1;
    while (Low <= High) {
        Mid = (Low + High) / 2;
        if (x < A[Mid]) {
            High = Mid;
        } else if (x > A[Mid]) {
            Low = Mid + 1;
        } else {
            return Mid;
        }
    }
    return -1;
}

int main() {
    ElementType Array[] = {1, 7, 4, 3, 2, 5, 7};
    printf("%d\n", BinarySearch(Array, 0, 7));
    
    return 0;
}
```

## 3. Euclid's Algorithm ( O(logN) )

```c
int gcd(int x, int y) {
    int t;
    if (x < y) {
        t = x;
        x = y;
        y = t;
    }
    
    while (y > 0) {
        t = x;
        x = y;
        y = t % y;
    }
    return x;
}
```

## 4. Exponentiation
```c
long int Pow( int X, int N ) {
    if (N == 0) {
        return 1;
    } else if( N % 2 == 0) {
        return Pow(X * X, N / 2);
    } else {
        return Pow(X * X, N / 2) * X;
    }
    
}
```

## 5. Exercises
### 5.1 Calculate $$\sum_{i=0}^N A_iX^i$$
```c
long int Cal(int A[], int X, int N){
    long int sum = 0;
    sum = A[0];
    for (int i = 0; i < N - 1 ; i++) {
        sum = X * sum + A[i + 1];
    }
    return sum;
}
```

### 5.2 Three Ways to generate numbers between A and B
#### Way 1
```c
int inIt(int * arr, int x, int n) {
    for (int i = 0; i < n; ++ i) {
        if (x == arr[i]) {
            return 1;
        }
    }
    return 0;
}

int* generateA(const int x, const int y) {
    int* A = malloc(sizeof(int) * (y - x + 1));
    int generated;
    srand((unsigned int)time(NULL));
    int i = 0;
    for (int i = 0; i < y - x + 1; ++i) {
        A[i] = -1;
    }
    while (i < (y - x + 1)) {
        generated = rand() % (y - x + 1);
        if (inIt(A, generated, i) == 0) {
            A[i++] = generated;
        }
    }
    return A;
}
```
#### Way 2
```c
int* generateB(const int x, const int y) {
    int* A = malloc(sizeof(int) * (y - x + 1));
    int generated;
    srand((unsigned int)time(NULL));
    int* Used = malloc(sizeof(int) * (y - x + 1));
    for (int i = 0; i < y - x + 1; ++i) {
        Used[i] = 0;
    }
    int i = 0;
    while (i < (y - x + 1)) {
        generated = rand() % (y - x + 1);
        if (Used[generated] == 0) {
            Used[generated] = 1;
            A[i++] = generated;
        }
    }
    return A;
}
```
#### Way 3
```c
int* generateC(const int x, const int y) {
    int* A = malloc(sizeof(int) * (y - x + 1));
    for (int i = 0; i < y - x + 1; ++i) {
        A[i] = i ;
    }
    for (int i = 0; i < y - x + 1; ++ i) {
        swap(&A[i], &A[RandonInt(0, i)]);
    }
    return A;
}
```



