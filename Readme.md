# Instruções para rodar

Container:
- docker-compose up mysql -d
- docker-compose up app -d

Indicado rodar pelo menos o banco de dados

Terminal:
- npm run migration (para add as tables do banco)
- npm run start

Abordei um estilo mais próximo ao funcional para demonstrar alguns dos benefícios do node no qual acabamos evitando o alto consumo de memória com objetos desnecessários dos frameworks.
Implementei um sistema de log que permite que possamos adicionar um possível ELK para criar dashs do Grafana
Para a aplicação não sofrer com o uso excessivo de solicitações de crawler, fiz uma lógica que tange a recorrência controlada pela table processess, dentro da mesma temos uma coluna que nos traz alguns status que encontram-se no arquivo de enuns dentro do projeto
A partir do momento que a aplicação inicia passamos por uma rotina de ver se existe algum processo que não foi concluído, havendo tal a aplicação reinicia o processo de coleta novamente
Todas as legendas encontrada ficam no banco de dados
