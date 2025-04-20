const axios = require('axios');
const cheerio = require('cheerio');
const sitealvo = 'https://agenciagov.ebc.com.br/noticias';

function extrairDados(link)  {
    return axios.get(link).then((response) => {
        const dadoshtml = response.data;
        const $ = cheerio.load(dadoshtml);
        
        const noticia = {
            titulo: $('h1').text(),
            linkimg: $('img').attr('src'),
            datapublicacao: $('div[class="data-publicacao data-publicacao-v2"]').text(),
            texto: $('p').text()
        };
        
        console.log(noticia); // Imprime a notícia diretamente
        return noticia; // Retorna a notícia para uso posterior, se necessário
    }).catch(error => {
        console.error(`Erro ao extrair dados de ${link}:`, error.message);
    });
}

const linksPromise = axios.get(sitealvo).then((response) => {    
    const dadoshtml = response.data;
    
    const $ = cheerio.load(dadoshtml);
    const noticias = [];
    
    $('li>a').each((i, e) => {
        const link = $(e).attr('href');
        noticias.push(link);
    });
    
    return noticias;
}).catch(error => {
    console.error('Erro ao obter links:', error.message);
    return []; // Retorna array vazio em caso de erro
});

async function main() {             
    try {
        const links = await linksPromise;
        
        // Corrigindo o uso do map - o primeiro parâmetro é o elemento, não o índice
        // forEach é mais apropriado aqui já que não estamos usando o valor retornado
        links.forEach((link) => {
            extrairDados(link);
        });
        
        console.log(`Total de links processados: ${links.length}`);
    } catch (error) {
        console.error('Erro na função principal:', error.message);
    }
}

main();
