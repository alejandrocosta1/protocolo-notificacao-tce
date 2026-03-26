# 🏛️ Protocolo de Notificação Eletrônica - TCE/CE

Sistema desenvolvido para a **Secretaria de Serviços Processuais do Tribunal de Contas do Estado do Ceará (TCE/CE)**. O projeto automatiza a confirmação de ciência de notificações processuais enviadas via WhatsApp, conferindo agilidade e fé pública ao registro.

---

## 🎯 Objetivo do Projeto
Substituir o controle manual de confirmações por um fluxo digital automatizado, onde o interessado registra sua ciência em um formulário oficial e recebe instantaneamente um comprovante de protocolo por e-mail institucional.

## 🚀 Funcionalidades Principais
| Funcionalidade | Descrição |
| :--- | :--- |
| **Interface Responsiva** | Design otimizado para smartphones (iOS/Android) e navegadores desktop. |
| **Validação Jurídica** | Termos de declaração de veracidade e ciência inequívoca integrados. |
| **Envio de Comprovante** | Automação via Gmail API com layout institucional e logo do Tribunal. |
| **Prevenção de Erros** | Validação em tempo real para evitar registros duplicados de um mesmo ofício. |
| **Consulta de Fé Pública** | Link de verificação de autenticidade que consulta a base de dados em tempo real. |

## 🛠️ Arquitetura Técnica
O sistema utiliza o ecossistema Google para garantir baixo custo de manutenção e alta disponibilidade:

* **Frontend:** HTML5, CSS3 (Custom Properties) e JavaScript assíncrono.
* **Backend:** Google Apps Script (Engine V8).
* **Persistência:** Google Sheets (como Database relacional simplificado).
* **Segurança:** Controle de permissões via conta institucional e políticas de X-Frame-Options.

## 📦 Como Implementar (Setup)
1. Crie uma Planilha Google com uma aba chamada `Respostas`.
2. Acesse **Extensões > Apps Script**.
3. Insira o conteúdo de `Codigo.js` e crie um arquivo HTML chamado `Index.html`.
4. Altere a variável `urlBaseOficial` no script para a URL gerada na implantação.
5. Realize o **Deploy** como "App da Web" com acesso para "Qualquer pessoa".
