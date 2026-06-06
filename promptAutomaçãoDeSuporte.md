Implemente no meu sistema Vault apenas o módulo de suporte automático de login.

Contexto:
Meu sistema Vault já existe e o webhook da Cakto já está funcionando corretamente. Não altere o webhook da Cakto, não recrie o sistema e não mude a estrutura principal do projeto.

Objetivo:
Adicionar funcionalidades para o cliente resolver sozinho problemas de acesso, sem depender de suporte manual.

Implementar somente:

1. Esqueci minha senha
- Criar tela/rota de recuperação de senha.
- O cliente informa o e-mail cadastrado.
- O sistema gera um token seguro e temporário.
- Envia um link de redefinição de senha para o e-mail.
- O token deve expirar em 15 ou 30 minutos.
- Após o uso, o token deve ser invalidado.
- A nova senha deve ser salva criptografada.
- A resposta deve ser genérica:
  “Se este e-mail estiver cadastrado, enviaremos um link de recuperação.”

2. Redefinir senha
- Criar tela/rota para redefinir senha usando o token recebido por e-mail.
- Validar se o token existe, não expirou e ainda não foi usado.
- Permitir criar nova senha.
- Confirmar nova senha.
- Atualizar a senha do usuário.
- Invalidar o token após o uso.
- Redirecionar para login após sucesso.

3. Não recebi meu acesso
- Criar tela/rota para reenvio de acesso.
- O cliente informa o e-mail usado na compra.
- O sistema verifica se existe usuário ou compra aprovada vinculada a esse e-mail.
- Se o usuário ainda não criou senha, enviar novamente o link de primeiro acesso.
- Se o usuário já criou senha, enviar link para login ou recuperação de senha.
- Não criar compra nova.
- Não alterar o webhook.
- Apenas usar os dados já existentes no banco.

4. Comprei com e-mail errado
- Criar tela/rota para correção de e-mail.
- O cliente informa:
  - e-mail usado na compra;
  - novo e-mail;
  - ID da compra, código do pedido ou outro dado já salvo no banco.
- Validar:
  - se o e-mail antigo existe no sistema;
  - se existe compra aprovada vinculada;
  - se o ID/código informado bate com a compra;
  - se o novo e-mail ainda não está em uso.
- Se tudo estiver correto:
  - atualizar o e-mail do usuário;
  - atualizar o e-mail da compra, se existir tabela de compras;
  - invalidar tokens antigos;
  - gerar novo link de acesso ou recuperação;
  - enviar para o novo e-mail.
- Se não validar:
  - mostrar erro genérico:
    “Não foi possível validar os dados. Verifique as informações e tente novamente.”

5. Banco de dados
Não recriar tabelas existentes.
Verificar a estrutura atual e reaproveitar tabelas já existentes.

Adicionar apenas o que for necessário, como uma tabela de tokens:

access_tokens:
- id
- user_id
- token_hash
- type
- expires_at
- used_at
- created_at

Tipos de token:
- password_reset
- first_access
- resend_access
- email_change

6. Segurança básica
- Usar bcrypt para senhas.
- Não salvar token puro no banco, salvar hash do token.
- Gerar tokens seguros.
- Tokens devem expirar.
- Tokens usados não podem ser reutilizados.
- Validar formato de e-mail.
- Bloquear e-mail duplicado.
- Adicionar limite de tentativas por IP/e-mail.
- Não revelar se um e-mail existe ou não na recuperação de senha.

7. Interface
Na tela de login, adicionar os links:
- Esqueci minha senha
- Não recebi meu acesso
- Comprei com e-mail errado

Criar telas seguindo o estilo visual atual da Vault:
- recuperação de senha;
- redefinição de senha;
- reenvio de acesso;
- correção de e-mail.

8. E-mails automáticos
Criar templates simples para:
- recuperação de senha;
- primeiro acesso;
- reenvio de acesso;
- correção de e-mail.

Os links devem usar a URL base do sistema, por exemplo:
FRONTEND_URL/reset-password?token=TOKEN

9. Importante
- Não alterar o webhook da Cakto.
- Não recriar autenticação do zero.
- Não quebrar o login atual.
- Não remover funcionalidades existentes.
- Apenas adicionar o módulo de autoatendimento de acesso.
- Antes de alterar, analisar o padrão atual de rotas, controllers, models, banco e frontend.

Resultado esperado:
Entregar a implementação completa do módulo de autoatendimento de login integrado ao sistema Vault já existente.