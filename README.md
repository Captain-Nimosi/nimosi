# Nimosi Archive Site Manual

## 카테고리 목록

| 카테고리 slug | 용도 | 상태 |
|---|---|---|
| `thoughts` | 일상 기록 | 운영중 |
| `canada` | 워킹홀리데이 (비자~정착) | 운영중 |
| `money` | 자산/지출 기록 | 예정 |
| `kitchen` | 요리 기록 | 운영중 |

## 새 카테고리 추가하는 법

1. 루트에 스텁 파일 하나 생성: `카테고리명.html`
```yaml
   ---
   layout: category
   title: 카테고리명
   category_name: 카테고리명
   permalink: /카테고리명/
   ---
```
2. 위 표에 한 줄 추가
3. 글 쓸 때 `categories: [카테고리명]`으로 태그하면 홈 화면에 자동으로 뜸

## 카테고리 삭제하는 법

1. 해당 스텁 파일(`카테고리명.html`) 삭제
2. 그 카테고리 글들 삭제 or 다른 카테고리로 재태그
3. 위 표에서 줄 삭제

## 새 글 쓰는 법

경로: `_posts/카테고리명/YYYY-MM-DD-파일명.md`

```markdown
---
layout: post
title: "제목"
date: YYYY-MM-DD
categories: [카테고리명]
---

본문 내용.

문단 사이는 빈 줄로 구분.
```

## 초안(임시저장)

`_posts/` 대신 `_drafts/파일명.md`로 저장 (날짜 접두어 없음) → 사이트에 안 뜸.
발행할 땐 `_posts/카테고리/YYYY-MM-DD-파일명.md`로 이름 바꿔서 이동.

## 사진 넣기

경로: `assets/images/파일명.jpg` (한글/공백 금지, 영문+하이픈)

```markdown
![설명](/nimosi/assets/images/파일명.jpg)
```

## 디자인 규칙

- 폰트: Noto Serif
- 정렬: 왼쪽 상단
- 링크: 파란색(#0000EE) + 밑줄
- `back` 링크만 검정(#111) + 밑줄
- 페이지 상단: 그 페이지 제목 (볼드, 링크 아님)
