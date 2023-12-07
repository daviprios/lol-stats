# LoL Stats

## Descrição do projeto

O projeto **LoL Stats** ou **Datavis LoL**, é uma breve demonstração de como a visualização de dados pode ser utilizada, com base nos dados do **LoL**, para extrair analises diversas. Essa demonstração aparece, primeiramente, como prova de conceito sobre o assunto.

Nossa visualização é apresentada na forma de 4 visualizações diferentes e 100 partidas de um jogador aleatório, que buscam analisar, mesmo que de forma simples e superficial, 4 aspectos diferentes que um jogador pode ter ao longo de várias partidas ou em uma única partida, sendo elas:

- Relação Escolha X Vitória entre os personagens diferentes de um mesmo jogador;
- Desempenho de um mesmo parâmetro do jogador ao longo de várias partidas;
- Relação killer-victim (assassino-vítima) entre os 10 jogadores da partida;
- Heatmap com a posição dos 10 jogadores ao longo da partida.

Na relação Escolha X Vitória, podemos analisar quais personagens são desempenhados bem e poderiam ser repetidos, e quais personagens não deveriam ser repetidos, com base na taxa de vitória, positiva ou negativa, das partidas de tal personagem.

No gráfico de desempenho por parâmetros, é possivel analisar dados de ouro por minuto, KDA (assassinatos/mortes/assistências), CS (Creep Score, ou Tropas eliminadas) por minuto, dano a campeões inimigos. Cada um desses parâmetros pode ser observados em vitórias e derrotas ou por personagem jogado, gerando compreensões de como eles podem ser causadores ou reflexos de um melhor desempenho do jogador.

A relação killer-victim serve para mostrar como cada jogador de um time impacta negativamente em um ou mais jogadores do outro time. Serve para mostrar quais adversários causam mais problema.

Por último, o _Heatmap_ serve para mostrar qual o posicionamento dos jogadores ao longo do jogo, e serve como reflexo de atividade e de prováveis impactos causados no mapa pelos jogadores.

## Base de dados

A base de dados utilizada para o projeto, foi resultado da coleção de recursos da [API oficial da Riot Games](https://developer.riotgames.com/apis). Os endpoints utilizados foram o de [informação da partida](https://developer.riotgames.com/apis#match-v5/GET_getMatch), onde foram buscadas informações finalizadas sobre a partida, e de [linha do tempo da partida](https://developer.riotgames.com/apis#match-v5/GET_getTimeline), onde conseguimos dados sobre eventos ao longo da partida como: relação de killer-victim e posição dos jogadores.

## Ferramentas

A visualização foi feita através de desenvolvimento de _site_ e utilizando a [biblioteca/_framework_ ReactJS](https://react.dev/) para criação da página, e as bibliotecas [D3](https://d3js.org/) e [Observable Plot](https://observablehq.com/plot/) para criação das visualizações gráficas.

O _site_ também foi originalmente [hospedado na Vercel](https://vercel.com/) atráves do link <https://datavis-ten.vercel.app/>.

## Processamentos

Nenhum pré-processamento foi necessário para correção, ajuste, modificação da base de dados fornecida pela API, porém ainda foram realizados os processamentos mais básicos para demonstração de dados em tela como:

- Relacionamente entre os dados de jogador entre as bases de partida e de linha do tempo;
- Cálculo de taxa de vitória/escolha;
- Formatação de dado numerico.
