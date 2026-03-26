function doGet(e) {
  var tela = HtmlService.createTemplateFromFile('Index');
  tela.nome = e.parameter.nome || '[Nome não informado]';
  tela.cpf = e.parameter.cpf || '[CPF não informado]';
  tela.processo = e.parameter.processo || '[Processo não informado]';
  tela.oficio = e.parameter.oficio || '[Ofício não informado]';
  
  var rawWhats = e.parameter.whats || '';
  var whatsLimpo = rawWhats.replace(/\D/g, ''); 
  var whatsMascarado = (whatsLimpo.length >= 10) ? "(" + whatsLimpo.substring(0, 2) + ") XXXXX-" + whatsLimpo.substring(whatsLimpo.length - 4) : rawWhats;
  tela.whats = whatsMascarado;

  tela.modoVisualizacao = (e.parameter.view === 'true');
  tela.dataHoraConsulta = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy HH:mm:ss");
  tela.dataHoraAssinaturaOriginal = "";

  if (tela.modoVisualizacao) {
    try {
      var aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Respostas"); 
      var dadosSheet = aba.getDataRange().getValues();
      for (var i = 1; i < dadosSheet.length; i++) {
        if (dadosSheet[i][3] == tela.processo && dadosSheet[i][4] == tela.oficio) {
          var valData = dadosSheet[i][0];
          tela.dataHoraAssinaturaOriginal = Utilities.formatDate(new Date(valData), "GMT-3", "dd/MM/yyyy HH:mm:ss");
          break; 
        }
      }
    } catch(err) { Logger.log(err); }
  }
  
  var urlBaseOficial = "https://script.google.com/macros/s/AKfycbxf4k3dhu5g6s2jAm2s9rV_LXOJt76Qde6R3MYKAJ_QEBu_MKB1IUyOUR3hTxDUwWyk/exec";
  tela.linkReal = urlBaseOficial + "?nome=" + encodeURIComponent(tela.nome) + "&cpf=" + encodeURIComponent(tela.cpf) + "&processo=" + encodeURIComponent(tela.processo) + "&oficio=" + encodeURIComponent(tela.oficio) + "&whats=" + encodeURIComponent(rawWhats) + "&view=true"; 
  
  return tela.evaluate()
    .setTitle('Protocolo de Notificação - TCE/CE')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function salvarDados(dados) {
  try {
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName("Respostas"); 
    var logs = aba.getDataRange().getValues();
    for (var i = 1; i < logs.length; i++) {
      if (logs[i][3] == dados.processo && logs[i][4] == dados.oficio) return "DUPLICADO";
    }
    aba.appendRow([new Date(), dados.nome, dados.cpf, dados.processo, dados.oficio, dados.whatsMascarado, "Ciência confirmada via autenticação eletrônica", dados.link]);
    return "SUCESSO";
  } catch(e) {
    return "ERRO_PLANILHA";
  }
}

function enviarComprovanteEmail(emailUsuario, dados) {
  try {
    var nomeVal = dados.nome || "Usuário";
    var oficioVal = dados.oficio || "Não informado";
    var processoVal = dados.processo || "Não informado";
    var linkVal = dados.link || "#";
    var dataH = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy HH:mm:ss");

    var assunto = "Comprovante de Notificação Eletrônica - Ofício " + oficioVal + " - TCE/CE";
    
    // LINK ALTERNATIVO DA LOGO BRANCA (MAIS COMPATÍVEL COM GMAIL WEB)
    var urlLogo = "https://agora.tce.ce.gov.br/assets/layout/logos/logo_tce_branca_pt-440.png";

    var corpoHtml = 
      "<div style='font-family: Arial, sans-serif; color: #333; padding: 10px; background-color: #f4f7f9;'>" +
        "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e1e4e8;'>" +
          
          "<div style='background-color: #194383; padding: 20px; text-align: center;'>" +
            // Adicionado estilo inline para garantir renderização
            "<img src='" + urlLogo + "' style='height: 45px; width: auto; display: block; margin: 0 auto;' alt='TCE-CE' border='0'>" +
          "</div>" +

          "<div style='padding: 25px;'>" +
            "<h2 style='color: #194383; margin-top: 0; font-size: 20px;'>Comprovante de Ciência</h2>" +
            "<p style='font-size: 15px;'>Prezado(a) <b>" + nomeVal + "</b>,</p>" +
            "<p style='font-size: 14px; line-height: 1.5;'>Confirmamos o registro oficial de sua ciência eletrônica no sistema da <b>Secretaria de Serviços Processuais do TCE/CE</b>.</p>" +
            
            "<div style='background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #194383; margin: 20px 0;'>" +
              "<p style='margin: 5px 0; font-size: 14px;'><b>Ofício(s):</b> " + oficioVal + "</p>" +
              "<p style='margin: 5px 0; font-size: 14px;'><b>Processo(s):</b> " + processoVal + "</p>" +
              "<p style='margin: 5px 0; font-size: 14px;'><b>Data do Registro:</b> " + dataH + "</p>" +
            "</div>" +

            "<p style='font-size: 14px; text-align: center; margin-top: 25px;'>" +
              "Para validar este registro em nossos servidores:<br><br>" +
              "<a href='" + linkVal + "' style='color: #194383; font-weight: bold; text-decoration: underline; font-size: 16px;'>CLIQUE AQUI PARA CONFERIR</a>" +
            "</p>" +
          "</div>" +

          "<div style='background-color: #eee; padding: 20px; text-align: center; font-size: 11px; color: #666; line-height: 1.6;'>" +
            "<b>Tribunal de Contas do Estado do Ceará</b><br>" +
            "Rua Sena Madureira, 1047 - CEP: 60055-080 - Fortaleza/CE<br>" +
            "Telefone: (85) 3125.8336 - Ouvidoria: (85) 3125.8334 e (85) 3125.8335<br>" +
            "Site: <a href='https://www.tce.ce.gov.br' target='_blank' style='color: #194383; text-decoration: none;'>www.tce.ce.gov.br</a><br>" +
            "<p style='margin-top: 10px;'><i>Este é um e-mail automático, favor não responder.</i></p>" +
          "</div>" +
        "</div>" +
      "</div>";

    GmailApp.sendEmail(emailUsuario.trim(), assunto, "", {
      htmlBody: corpoHtml,
      name: "TCE-CE - Secretaria de Serviços Processuais"
    });

    return "ENVIADO";
  } catch (e) {
    console.error("Erro no e-mail: " + e.toString());
    return "ERRO_EMAIL";
  }
}
