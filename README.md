# Monorepo

A monorepo contains frontend and backend, based on pnpm workspace

author: kk4201@126.com

## Introduction

### Backend

Based on NestJS

The package path is _packages\backend_, the main business modules are in **packages\backend\src\modules**

### Frontend

Based on Vite + Vue3 + Pinia

The package path is _packages\frontend_, the main business modules are in **packages\frontend\src\components**

## Getting Started

### IDE

[VSCode](https://code.visualstudio.com/) + Extensions:

- EditorConfig
- ESLint
- Prettier - Code formatter
- Volar

### Dependents

- Mysql >= 5.7

```
cd docker
docker-compose up -d
```

- NodeJs >= 22
- Pnpm >= 10

```
npm install -g pnpm
```

### Install dependencies

```
pnpm install
```

### Compiles and hot-reloads for development

Start backend development

```
pnpm dev:be
```

Start frontend development

```
pnpm dev:fe
```

Start all in one command

```
pnpm dev:all
```

Open the follow url in your browser:
http://localhost:7000/app

### Run your tests

TODO

### Lints and fixes files

```
pnpm lint
```

## Known Issues

- Issue
    - cause:
    - workaround:
