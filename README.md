# Trabalho Final - ELC1092 (2019.02)
Repositório destinado ao [trabalho final](./Descricao.txt) da disciplina de Linguagem de Marcação Extensível</br>

## Alunos
   * **[Marlon Leoner](https://github.com/marlonleoner)**</br>
   * **[Mattheus Einloft](https://github.com/MattheusEinloft)**

## Configurando
### Pré-requisitos

O trabalho desenvolvido utiliza as seguintes ferramentas:
   * A plataforma, construída sobre o JavaScript, [Node.js](https://nodejs.org/en/);
   * Um gerenciador de pacotes para Javascript: [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
</br>Obs.: No desenvolvimento foi utilizado o Yarn como gerenciador.

### Instalação
Com ambas as ferramentas instaladas, Node.js e algum dos gerenciadores de pacotes, é necessário que todas as dependências do projeto sejam instaladas. Dentro da raiz do projeto, basta executar o comando abaixo:
```bash
$ yarn
```
Terminado o processo de configuração das dependências do projeto, basta executar o comando referente a parte desejada:
```bash
# Parte 1
$ yarn parte1
# Parte 2
$ yarn parte2
# Parte 3
$ yarn parte3
# Parte 4
$ yarn parte4
```

### Trabalho
O trabalho proposto é divido em quatro partes. Sendo elas:

1. Transformar o arquivo de filmes em XML para JSON, sem perder conteúdo.

2. Validar o JSON criado com JSON Schema correspondente.

3. Aplicar consultas em JSON.

4. Aplicar transformações em JSON.

#### [Parte 1](./Parte1/index.js) - Conversão
Na primeira parte deste trabalho é necessário realizar a conversão do arquivo [GioMovies.xtm](./GioMovies.xtm) para JSON, sem ocorrer perda do conteúdo. Para executar esta etapa, basta utilizar o código abaixo:
   ```bash
   $ yarn parte1
   ```

#### [Parte 2](./Parte2/index.js) - Validação
A etapa seguinte é responsável por realizar a validação do arquivo JSON, gerado na etapa anterior. Para executar esta etapa, basta utilizar o código abaixo:
   ```bash
   $ yarn parte2
   ```

#### [Parte 3](./Parte3/index.js) - Consultas
Na terceira etapa é onde ocorre as consultas sobre o arquivo JSON, gerado na primeira parte. As consultas, que devem ser realizadas, e o comando para executar esta etapa encontram-se descritos abaixo:
- a) Quais são os tipos de gênero de filmes, sem repetição?
- b) Quais são os títulos dos filmes que foram produzidos em 2000, ordenados alfabeticamente?
- c) Quais são os títulos em inglês dos filmes que tem a palavra “especial” na sinopse?
- d) Quais são os sites dos filmes que são do tipo “thriller”?
- e) Quantos filmes contém mais de 3 atores como elenco de apoio?
- f) Quais são os ID dos filmes que tem o nome de algum membro do elenco citado na
sinopse?
```bash
$ yarn parte3
```

#### [Parte 4](./Parte4/index.js) - Transformação
Deve se construir um código que gere um conjunto de páginas HTML para cada nodo do grafo, onde nesta página possui a informação de cada tópico (seus nomes e ocorrências), além de links para todos os tópicos que estão associados com ele. A página inicial terá a apresentação do portal e o link para todos os filmes.  Para executar esta etapa, basta utilizar o código abaixo:
   ```bash
   $ yarn parte4
   ```
