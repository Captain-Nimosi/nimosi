# Nimosi Archive Site Manual

## 사이트 구조

사이트는 다음 구조로 운영한다.

- `nimosi` — Home
- `about` — 개인 소개
- `archive` — 카테고리 목록
- `category` — 카테고리별 글 목록
- `post` — 개별 글

Home에서는 카테고리를 직접 보여주지 않고 `about`과 `archive`로 연결한다.

Archive에서는 실제 포스트가 존재하는 카테고리만 자동으로 표시한다.

---

## 카테고리 목록

| 카테고리 slug | 용도 | 상태 |
|---|---|---|
| `thoughts` | 일상 기록 | 운영중 |
| `canada` | 워킹홀리데이 (비자~정착) | 운영중 |
| `money` | 자산/지출 기록 | 예정 |
| `kitchen` | 요리 기록 | 운영중 |

카테고리 slug는 소문자로 고정한다.

---

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

---

## 카테고리 삭제하는 법

1. 해당 스텁 파일(`카테고리명.html`) 삭제
2. 해당 카테고리의 글을 삭제하거나 다른 카테고리로 재태그
3. 위 카테고리 목록에서 해당 줄 삭제

Archive는 실제 포스트가 있는 카테고리만 자동으로 표시하므로, 포스트가 모두 없어지면 Archive에서도 자동으로 사라진다.

---

## 새 글 쓰는 법

경로:
```text
_posts/YYYY-MM-DD-파일명.md
```

파일명은 반드시 `YYYY-MM-DD-파일명.md` 형식을 사용한다.

```yaml
---
layout: post
title: "제목"
date: YYYY-MM-DD
categories: [카테고리명]
---

본문 내용.

문단 사이는 빈 줄로 구분.
```

`categories`에 지정한 카테고리의 페이지에 해당 글이 자동으로 표시된다.

---

## 초안 (임시저장)

`_posts/` 대신 `_drafts/파일명.md`로 저장한다.

날짜 접두어는 필요 없다.
```text
_drafts/파일명.md
```

초안은 사이트에 표시되지 않는다.

발행할 때:
```text
_drafts/파일명.md
→
_posts/YYYY-MM-DD-파일명.md
```
으로 이동하고 Front Matter에 날짜와 카테고리를 지정한다.

---

## 사진 넣기

사진 경로:
```text
assets/images/파일명.jpg
```

파일명은 한글과 공백을 사용하지 않는다.

권장 형식:
```text
영문-소문자-하이픈.jpg
```

Markdown에서:
```markdown
![설명](/nimosi/assets/images/파일명.jpg)
```

---

## about 페이지

파일: `about.md`

```yaml
---
layout: post
title: about
permalink: /about/
back_url: /
---
```

About은 `post.html`을 사용하며 back을 누르면 Home으로 돌아간다.

---

## archive 페이지

파일: `archive.md`

```yaml
---
layout: post
title: archive
permalink: /archive/
back_url: /
---
```

Archive는 `site.categories`를 이용해 포스트가 존재하는 카테고리만 자동으로 표시한다.

현재 카테고리는 알파벳순으로 표시된다.

```liquid
{% assign categories = site.categories | sort %}
{% for category in categories %}
<a href="{{ site.baseurl }}/{{ category[0] }}/">{{ category[0] }}</a><br>
{% endfor %}
```

---
## 검색 기능

### 구조

검색은 4개 파일로 구성된다.

| 파일 | 역할 |
|---|---|
| `search.json` | 전체 포스트를 JSON으로 변환한 검색 데이터 (빌드 타임에 자동 생성) |
| `search.md` | 검색 페이지. `post.html` layout을 사용하며 검색 UI 마크업 포함 |
| `assets/js/search.js` | 검색 로직 (데이터 fetch, 필터링, 결과 렌더링) |
| `_layouts/post.html` | 검색 UI의 CSS 정의 (hover 전환, 입력창, 결과 스타일) |

### 데이터 생성 방식

`search.json`은 `site.posts`를 순회하며 각 포스트의 `title`, `content`(HTML 태그 제거), `date`, `category`, `url`을 JSON 배열로 만든다.

별도 빌드 도구 없이 Jekyll이 페이지 빌드 시 자동으로 생성한다.

### 검색 동작 방식

1. 평소에는 `search`라는 텍스트만 표시된다 (`.search-label`)
2. 마우스를 올리면(hover) 밑줄 있는 입력창 + `go` 버튼으로 바뀐다
3. 검색어 입력 후 Enter 또는 `go` 버튼 클릭 시 `performSearch()` 실행
4. `search.json`에서 미리 불러온 데이터 중 title 또는 content에 검색어가 포함된 포스트만 필터링
5. 결과는 최신순(date 내림차순)으로 정렬돼 결과 영역에 렌더링
6. 검색이 한 번 실행되면 입력창이 hover 없이도 계속 유지된다

### 검색 결과 표시 항목

각 결과는 `날짜 + 제목`(파란 링크) 그리고 아래 줄에 `카테고리`를 함께 보여준다.

### 파일 간 관계

`search.md`의 본문(검색 UI 마크업)은 `post.html`의 `{{ content }}` 위치에 삽입된다.
따라서 검색 UI를 감싸는 CSS는 `post.html`에, 실제 요소는 `search.md`에 나뉘어 있다.
---

## back 링크 규칙

back은 무조건 브라우저의 직전 페이지로 돌아간다 (`javascript:history.back()`).

페이지 계층 구조와 무관하게 모든 페이지에서 동일한 방식으로 동작한다.

back 텍스트는 모든 페이지에서 `back`으로 고정한다.

---

## layout 구조

```text
_layouts/
├── home.html
├── category.html
└── post.html
```

**home.html**
Home 전용 layout. 표시 내용:
```text
nimosi

about
archive
```
사이트 제목은 `_config.yml`의 `title`에서 가져온다.

**category.html**
카테고리별 포스트 목록을 표시한다.

**post.html**
개별 포스트와 about, archive 페이지에서 공통으로 사용한다.
`back_url`이 지정된 페이지는 해당 URL로 돌아가고, 일반 포스트는 해당 카테고리로 돌아간다.

---

## 디자인 규칙

| 항목 | 값 |
|---|---|
| 폰트 | Noto Serif |
| 기본 글자 크기 | 14px |
| 페이지 제목 | 16px, Bold |
| 정렬 | 왼쪽 상단 |
| 배경 | 흰색 |
| 기본 텍스트 | `#111` |
| 링크 | 파란색 `#0000EE` + 밑줄 |
| 링크 Hover | `#0000AA` |
| back 링크 | 검정색 `#111` + 밑줄 |
| back 텍스트 | `back` |
| Body padding | `60px 40px` |
| Post/Page 본문 최대 너비 | `600px` |
| Post/Page 본문 line-height | `1.8` |
| Category/Post 목록 line-height | `2.2` |

---

## 이름 규칙

사이트에서 사용하는 주요 이름은 소문자로 고정한다.

```text
nimosi
about
archive
thoughts
canada
money
kitchen
back
```
