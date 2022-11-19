## Chat API
![Badge concluído](http://img.shields.io/static/v1?label=STATUS&message=CONCLUÍDO&color=GREEN&style=for-the-badge)

## Descrição do repositório
Este projeto é uma API de chat que contém um sistema de autenticação de usuário, além da criação de salas de conversa para troca de mensagens em tempo real. 

## Primeiros passos

Primeiramente é necessário ter o `NodeJS` em sua máquina e um banco em `MongoDB`.

## Variáveis de ambiente
Crie um arquivo `.env` e substitua as seguintes variáveis que contém **XXXXXXXX**

```env
PORT=3000
CONNECTIONSTRING=XXXXXXXX
JWTSECRET=XXXXXXXX
JWTEXPIRES=7d

```

## Instalação de dependências

```
$ npm install
```

## Execução

```
$ npm start
```

## Tecnologias utilizadas

- `MongoDB`
- `NodeJS`
- `Socket.IO`
