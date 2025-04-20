const axios = require('axios');
const cheerio = require('cheerio');

// Função para extrair links de notícias da página principal
async function extrairLinks(url) {
  try {
    const response = await axios.get(url);
    const dadoshtml = response.data;
    
    const $ = cheerio.load(dadoshtml);
    const links = [];
    
    $('li>a').each((i, e) => {
      const link = $(e).attr("href");
      
      // Filtrar apenas URLs que parecem ser de notícias
      // Verificando se contém "noticias" no caminho e não é a página de login
      if (link && 
          link.includes('/noticias/') && 
          !link.includes('/login') && 
          !link.includes('/busca')) {
        links.push(link);
      }
    });
    
    return links;
  } catch (error) {
    console.error('Erro ao extrair links:', error);
    return [];
  }
}

// Função para extrair detalhes de uma notícia específica
async function extrairDetalhesNoticia(url) {
  try {
    // Verificar se a URL parece ser uma notícia válida
    if (!url || !url.includes('/noticias/') || url.includes('/login') || url.includes('/busca')) {
      console.log(`Pulando URL que não parece ser uma notícia: ${url}`);
      return null;
    }
    
    const response = await axios.get(url);
    const dadoshtml = response.data;
    
    const $ = cheerio.load(dadoshtml);
    const titulo = $('h1').text();
    const linkimg = $('img').attr("src");
    const datapublicacao = $('div[class="data-publicacao data-publicacao-v2"]').text();
    const texto = $('p').text();
    
    // Verificar se conseguimos extrair um título (indicação de que é uma página de notícia válida)
    if (!titulo) {
      console.log(`URL não contém título de notícia: ${url}`);
      return null;
    }
    
    const dados = {titulo, linkimg, datapublicacao, texto};
    return dados;
  } catch (error) {
    console.error(`Erro ao extrair detalhes da notícia ${url}:`, error);
    return null;
  }
}

// Função principal que combina as duas funcionalidades
async function main() {
  const urlPrincipal = 'https://agenciagov.ebc.com.br/noticias';
  
  try {
    // Passo 1: Extrair links de notícias da página principal
    console.log('Extraindo links de notícias...');
    const links = await extrairLinks(urlPrincipal);
    console.log(`Foram encontrados ${links.length} links de notícias.`);
    
    // Passo 2: Extrair detalhes de cada notícia
    console.log('Extraindo detalhes das notícias...');
    const noticias = [];
    
    // Limitar a 5 notícias para não sobrecarregar o servidor
    const linksParaProcessar = links.slice(0, 5);
    
    for (const link of linksParaProcessar) {
      console.log(`Processando: ${link}`);
      const detalhes = await extrairDetalhesNoticia(link);
      if (detalhes) {
        noticias.push({
          url: link,
          ...detalhes
        });
      }
    }
    
    console.log('Resultado final:');
    console.log(JSON.stringify(noticias, null, 2));
    
    return noticias;
  } catch (error) {
    console.error('Erro na função principal:', error);
    return [];
  }
}

// Exportar as funções para uso em outros módulos
module.exports = {
  extrairLinks,
  extrairDetalhesNoticia,
  main
};

// Executar a função principal se este arquivo for executado diretamente
if (require.main === module) {
  main()
    .then(() => console.log('Processamento concluído com sucesso!'))
    .catch(err => console.error('Erro durante o processamento:', err));
}
