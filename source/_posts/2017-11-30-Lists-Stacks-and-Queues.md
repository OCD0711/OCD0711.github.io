title: Lists Stacks and Queues
author: OCD
category:
  - Programming
tags:
  - Develop
  - C
  - Data Structure
categories:
  - Programming
date: 2018-09-19 15:06:00
---
A Brief ADT Introduction to Lists Stacks and Queues

<!-- more -->

## 1. Lists
### 1.1 Lists ADTs
```c
#ifndef _LIST_H
#define _LIST_H
struct Node;
typedef struct Node *PtrToNode;
typedef PtrToNode List;
typedef PtrToNode Position;
typedef int ElementType;

List MakeEmpty(List L);
int IsEmpty(List L);
int IsLast(Position P, List L);
Position Find( ElementType X, List L);
void Delete( ElementType X, List L);
Position FindPrevious(ElementType X, List L);
void Insert(ElementType X, List L, Position P);
void DeleteList(List L);
Position Header(List L);
Position First(List L);
Position Advancde(Position P);
ElementType Retrieve(Position P);

#endif /* main_h */

struct Node {
    ElementType Element;
    Position Next;
};
```
#### 1.1.1 IsEmpty / IsLast
```c
int IsEmpty(List L) {
    return L->Next == NULL;
}

int IsLast(Position P, List L) {
    return P->Next == NULL;
}
```

#### 1.1.2 Find / Delete / FindPrevious / Insert
```c
Position Find( ElementType X, List L) {
    Position P;
    
    P = L->Next;        // Because there is a head
    while (P != NULL && P->Element != X) {
        P = P->Next;
    }
    return P;
}

void Delete( ElementType X, List L) {
    Position P, TempCell;
    P = FindPrevious(X, L);
    /* Avoid there is no such Element X */
    if (!IsLast(P, L)) {
        TempCell = P->Next;
        P->Next = TempCell->Next;
        free( TempCell );
    }
}

Position FindPrevious(ElementType X, List L) {
    Position P;
    P = L;
    
    while (P->Next != NULL && P->Next->Element != X) {
        P = P->Next;
    }
    return P;
}

void Insert(ElementType X, List L, Position P) {
    /* Insert X behind P */
    Position TempCell;
    
    TempCell = malloc(sizeof(struct Node));
    if (TempCell == NULL) {
        printf("Error no memory.\n");
    }
    TempCell->Element = X;
    TempCell->Next = P->Next;
    P->Next = TempCell;
}
```

### 1.2 Doubly Linked Lists

### 1.3 Circularly Linked Lists

### 1.4 Examples
#### The Polynomial __ADT__

Please refer to my [Github Repo](https://github.com/hellobbn/C-Program/tree/master/C-Programs/P-6) to see add and multiply.

#### Radix Sort 

Please refer to this [blog](http://austingwalters.com/radix-sort-in-c/) for some information.
```c
#include <stdio.h>
#include <stdlib.h>

void RadixSort(int* Array, int N) {
    int max = Array[0];
    int index = 10;
    int ret = 1;
    int* temp = malloc(sizeof(int) * N);
    for (int i = 0; i < N; ++ i) {
        if (max < Array[i]) {
            max = Array[i];
        }
    }
    while (max / ret > 0) {
        int init[10] = {0};
        for (int i = 0; i < N; ++ i) {
            init[(Array[i]/ret)%index] ++;
        }
        
        for (int i = 1; i < index; ++ i) {
            init[i] += init[i - 1];
        }
        
        for (int i = N - 1; i >= 0; -- i) {
            temp[--init[(Array[i] / ret) % index]] = Array[i];
        }
        
        for (int i = 0; i < N; ++ i) {
            Array[i] = temp[i];
        }
        ret *= index;
    }
}
int main() {
    int n;
    scanf("%d", &n);
    int* A = malloc(sizeof(int) * n);
    for (int i = 0; i < n; ++ i) {
        scanf("%d", A + i);
    }
    RadixSort(A, n);
    
    for (int i = 0; i < n; ++ i) {
        printf("%d\t", A[i]);
    }
}

```

#### Multilists

### 1.5 Cursor Implementation of Linked Lists
__In a language where pointers are not available, we use an array of structures to make Linked lists__

We use the following declaration
```c
/* A */
typedef int PtrToNode;
typedef PtrToNode Position;
typedef PtrToNode List;

struct Node {
    ElementType Element;
    Position Next;
};

struct Node CursorSpace[ SpaceSize ];
```

__/* B - An initialized CursorSpace */__

Slot|Element|Next
----|----|----
0 | | 1
1 | | 2
2 | | 3

__/* Example */__

if the value of L is 5 and the value of M is 3 
Then L presents the list _a, b, e_ M presents _c, d, f_

Slot|Element|Next
--- | --- | ---
0 | - | 6
1 | b | 9
2 | f | 0
3 | header | 7
4 | - | 0
5 | header | 10
6 | - | 4
7 | c | 8
8 | d | 2
9 | e | 0
10| a | 1

//  Unknown Why It is implied like this
We keep a list ( the _freelist_ ) of cells that are not in any list.
The list will use cell 0 as a header -- Shown in `section B`

```c
static Position CursorAlloc( void ) {
    Position P;
    
    P = CursorSpace[0].Next;
    Cursor[0].Next = CursorSpace[P].Next;
    
    return P
}

static void CursorFree( Position P ) {
    CursorSpace[P].Next = Cursor[0].Next;
    CursorSpace[0].Next = P;
}

int IsEmpty( List L ) {
    return CursorSpace[L].Next == 0
}

Position Find( ElementType X, List L) {
    Position = P;
    
    P = CursorSpace[L].Next;
    while(P && CursorSpace[P].Element != X) {
        P = CursorSpace[P].Next;
    }
    
    return P;
}

void Delete( ElementType X, List L) {
    Position P, TempCell;
    
    P = FindPrevious(X, L);
    
    if( !IsLast(P, L) ) {
        TempCell = CursorSpace[P].Next;
        CursorSpace[P].Next = CursorSpace[TempCell].Next;
        CursorFree(TempCell);
    }
```

## 2. The Stack ADT
* A stack is a list with the restriction that insertions and deletions can only be performed in one position.
* Stacks are sometimes known as `LIFO` ( Last in, First Out )
* Stacks use `push` and `pop` and only the top element is accessiable

![Figure 1](/images/stack.png)

### 2.1 Implementations of Stacks
#### 2.1.1 Linked List Implementation of Stacks
```c
#ifndef _Stack_h

struct Node;
typedef struct Node* PtrToNode;
typedef PtrToNode Stack;

int IsEmpty( Stack S );
Stack CreateStack( void );
void DisposeStack( Stack S );
void MakeEmpty( Stack S );
void Push( ElementType X, Stack S );
ElementType Top( Stack S );     //  Output the Top
void Pop( Stack S);             //  Only Delete

#endif

struct Node {
    ElementType Element;
    PtrToNode Next;
}
```

__Operations__

```c
int IsEmpty( Stack S ) {
    return S->Next == NULL;
}

Stack CreateStack( void ) {
    Stack S;
    
    S = malloc(sizeof( struct Node ));
    if( S == NULL )
        return NULL;
    MakeEmpty( S )
    return S;
void MakeEmpty( Stack S ) {
    if( S == NULL )
        printf("ERROR NO STACK\n");
    else
        while( !IsEmpty( S ) )
            Pop( S );
}

void Push( ElementType X, Stack S ) {
    PtrToNode TempCell;
    
    TempCell = malloc( sizeof( struct Node ) );
    if( TempCell == NULL )
        FatalError("Out of Space");
    else {
        TempCell->Element = X;
        TempCell->Next = S->Next;
        S->Next = TempCell;         //  Head Assumed
}
    
void Pop( Stack S ) {
    PtrToNode TempCell;
    
    if( IsEmpty( S ) ) {
        printf( "Empty Stack!\n" );
    else {
        TempCell = S->Next;
        S->Next = S->Next->Next;
        free(TempCell);
    }
}

ElementType Top( Stack S ) {
    if( !IsEmpty( S ) ) {
        return S->Next->Element;
    FatalError("Empty Stack\n");
    return 0;
}

```    

#### 2.1.2 Array Implementation of Stacks

This is probably a more popular solution

```c
typedef int ElementType;

#ifndef _Stack_H
#define _Stack_H

struct StackRecord;
typedef struct StackRecord *Stack;

int IsEmpty( Stack S );
int IsFull( Stack S );
Stack CreatStack( int MaxElements );
void DisposeStack( Stack S );
void MakeEmpty( Stack S );
void Push( ElementType X, Stack S );
ElementType Top( Stack S );
ElementType TopAndPop( Stack S );

#endif

#define EmptyEOS (-1)
#define MinStackSize (5)

struct StackRecord {
    int Capacity;
    int TopOfStack;
    ElementType* Array;
};
```

__Operations__
```c
/***** Create Stack *****/

Stack CreateStack( int MaxElements ) {
    Stack S;
    
    if( MaxElements < MinStackSize ) {
        Error("Stack too small.");
        
    S = malloc(sizeof( struct StackRecord ));
    if( S == NULL ) {
        FatalError("Out of Space!");
    }
    
    S->Array = malloc( sizeof(ElementType) * MaxElements;
    if( S->Array == NULL ) {
        FatalError("Out of space!");
    }
    S->Capacity = MaxElements;
    MakeEmpty( S );
    
    return S;
    
    void DisposeStack( Stack S ) {
        if( S != NULL ) {
            free( S->Array );
            free( S );
        }
    }
    
    int IsEmpty( Stack S ) {
        return S->TopOfStack == EmptyTOS;
    }
    
    void MakeEmpty( Stack S ) {
        S->TopOfStack = EmptyTOS;
    }
    
    void Push( ElementType X, Stack S ) {
        if( IsFull( S ) ) {
            Error("Full Stack");
        } else {
            S->Array[++(S->TopOfStack)] = X;
        }
    }
    
    ElementType Top( Stack S ) {
        if( !IsEmpty( S ) ) {
            return S->Array[S->TopOfStack];
        }
        Error("Empty Stack");
        return 0;
    }
    
    void Pop( Stack S ) {
        if( IsEmpty( S ) ) {
            Error("Empty Stack");
        } else {
            S->TopOfStack --;
        }
    }
```

### 2.2.2 Applications
#### 2.2.2.1 Balancing Symbols
 refer to [here](https://github.com/hellobbn/C-Program/tree/master/C-Programs/P-7) to get a sample code
#### 2.2.2.2 Postfix Expressions
refer to [here](https://github.com/hellobbn/C-Program/tree/master/C-Programs/P-1) to get a sample Code
#### 2.2.2.3 Function Calls
The algorithm to check balanced symbols suggests a way to implement function calls.

## 3. The Queue ADTs
Like stacks, _queues_ are lists.
__insertion__ are done at one end, __deletion__ is performed at the other end.

### 3.4.1 Queue Models
The basic operations on a queue are  _Enqueue_ and _Dequeue_

### 3.4.2 Array Implementation of Queues 
As with stacks, any implementation is legal for queues. Like stacks, both the linked lists and array implementation give fast __O(1)__ running times for every operation.  

Here we will discuss Array implementation of queues.

![Queues](/images/queue.png)

- For each queue data structure, we keep an array __Queue[]__ 
- Keep the positions `Front` and `Rear`
- We also keep track of the number of elements that are actually in the queue `Size`
- To __Enqueue__ an element X, we increment `Size` and `Rear`, then set `Queue[Rear] = X`
- To __Dequeue__ an element, we set the return value to `Queue[Front]`, decrement `Size` 

__Attention__ 
1. It's important to check the queue for emptiness 
2. Some programmers use different ways of representing the front and end of a queue.

### 3.4.3 Queue definitions
#### 3.4.3.1 Define a Queue
```c
#define ElementType int
#ifndef _Queue_h
#define _Queue_h
struct QueueRecord;
typedef struct QueueRecord* Queue;

int IsEmpty( Queue Q );
int IsFull( Queue Q );
Queue CreateQueue( int MaxElements );
void DisposeQueue( Queue Q );
void MakeEmpty( Queue Q );
void Enqueue( ElementType X, Queue Q );
ElementType Front( Queue Q );
void Dequeue( Queue Q );
ElementType FrontAndDequeue( Queue Q );
#endif	/* _Queue_h */

struct QueueRecord
{
	int Capacity;
	int Front;
	int Rear;
	int Size;
	ElementType *Array;
};
```
#### 3.4.3.2 Operations
__IsEmpty, MakeEmpty, Enqueue__
```c
int IsEmpty( Queue Q ) {
	return Q->Size == 0;
}

void MakeEmpty( Queue Q ) {
	Q->Size = 0;
	Q->Front = 1;
	Q->Rear = 0;
}

static int Succ( int Value, Queue Q ) {
	if (++Value == Queue->Capacity) {
		Value = 0;
	}
	return Value;
}

void Enqueue( ElementType X, Queue Q ) {
	if (IsFull( Q )) {
		Error("Error Full Queue");
	} else {
		Q->Size++;
		Q->Rear = Succ(Q->Rear, Q);
		Q->Array[Q->Rear] = X;
	}
}
```
### 3.4.4 Applications of Queues
- Calls to large companies are generally placed in a queue when all operations are busy
- In large universities when resources are limited