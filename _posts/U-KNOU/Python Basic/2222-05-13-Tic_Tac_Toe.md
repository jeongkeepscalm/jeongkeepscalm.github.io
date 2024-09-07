---
title: "[U-KNOU] 파이썬 게임 Tic_Tac_Toe"
description: "[U-KNOU] 파이썬 게임 Tic_Tac_Toe"
date: 2222-05-13
categories: [ Python, Python Game ]
tags: [ Python, Python Game ]
---

## Tic Tac Toe

```python
import random

class Tic_Tac_Toe:

    # 게임판 생성
    def __init__(self):
        self.board = []

    # 게임판 초기화
    def create_board(self):
        for i in range(3):                       # 0,1,2
            row = []
            for j in range(3):
                row.append("*")
            self.board.append(row)
        
    # 첫 플레이어 선택
    def select_first_player(self):
        if random.randint(0, 1) == 0:            # 0, 1
            return "X"                           # computer
        else:
            return "O"                           # user

    # 기호 표시
    def mark_spot(self, row, col, player):
        self.board[row][col] = player            # player 는 "O" / "X" 값으로 넘어온다. 

    # 승리 상태 확인
    def is_win(self, player):

        n = len(self.board)                      # 3
        
        # 행 확인
        for i in range(n):
            win = True
            for j in range(n):
                if self.board[i][j] != player:
                    
                    win = False
                    break
            if win == True :
                return win
                
        # 열 확인
        for i in range(n):
            win = True
            for j in range(n):
                self.board[j][i] != player       
                win = False
                break
            if win == True :
                return win
                
        # "\" 대각선 확인
        win = True
        for i in range(n):
            if self.board[i][i] != player:
                win = False
                break
        if win == True:
            return win
            
        # "/" 대각선 확인
        win = True
        for i in range(n):
            if self.board[i][n - i - 1] != player:
                win = False
                break
        if win == True:
            return win
        
        return False
        
    # 잔여 빈칸 여부 확인
    def is_board_full(self):
        for row in self.board:
            for item in row:
                if item == "*":
                    return False
        return True     
            
    # 플레이어 변경
    def next_player(self, player):
        return "X" if player == "O" else "O"

    # 현재 게임판 상태 출력
    def show_board(self):
        for row in self.board:
            for item in row:
                print(item, end=" ")
            print()

    # 게임 시작
    def start(self):
        
        # 새 게임판 생성
        self.create_board()
        self.show_board()
        
        # 첫 플레이어 선택
        player = self.select_first_player()

        # 게임 루프 시작
        while True:

            # 다음 플레이어 안내
            if player == "X":
                print("컴퓨터 차례입니다.")
            else:
                print("사용자 차례입니다.")
            
            # 현재 게임판 상태 출력
            self.show_board()

            # 사용자 입력 대기, 컴퓨터일 경우 랜덤 위치 반환
            if player == "X":
                # 빈칸을 찾을 때까지 반복
                while True:
                    row, col = random.randint(1,3), random.randint(1,3)
                    if self.board[row-1][col-1] == "*": 
                        break
                print("컴퓨터가 행 " + str(row) + ", 열 " + str(col) + "을/를 선택했습니다.")
                print()
            else:
                # split으로 분리된 문자열을 int로 바꾼 후 리스트화 시켜 값을 대입한다. 
                row, col = list(map(int, input("선택할 빈칸의 위치를 입력하세요: ").split())) 
                print("사용자가 행 " + str(row) + ", 열 " + str(col) + "을/를 선택했습니다.")
                print()

            # row, col 입력값이 9, 9 인 경우 게임 종료
            if row == 9 and col == 9:
                print("게임을 포기하셨습니다.")
                break

            # 입력된 위치 표시
            self.mark_spot(row-1, col-1, player)
            self.show_board()

            # 현재 플레이어가 이겼는지 확인
            if self.is_win(player) == True:
                if player == "X":
                    print("컴퓨터의 승리입니다. 다시 도전하세요.")
                else:
                    print("사용자의 승리입니다. 축하합니다.")
                break

            # 게임판이 가득찼는지 확인
            if self.is_board_full() == True:
                print("무승부입니다. 다시 도전하세요.")
                break

            # 플레이어 변경
            player = self.next_player(player)

        # 최종 게임판 출력
        print()
        self.show_board()

        
# 게임 생성
TTT = Tic_Tac_Toe()

# 게임 시작
TTT.start()
```
