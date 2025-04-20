/**
 * Objetivo:
 * titulo: Web Scraping - Pagina Filho:
 * linkimg:
 * datapublicacao:
 * texto:
 * 
 * 
 * 
 */



const axios = require('axios');
const cheerio = require('cheerio');

const urlfilho = 'https://agenciagov.ebc.com.br/noticias/202504/luz-para-todos-beneficiou-cerca-de-30-mil-indigenas-do-brasil-desde-agosto-de-2023';
// const urlfilho = 'https://agenciagov.ebc.com.br/noticias/202504/dia-dos-povos-indigenas-o-conhecimento-ancestral-e-a-ultima-fronteira-contra-a-destruicao-afirma-lula';

axios.get(urlfilho).then((response) => {
    const dadoshtml = response.data;
    
    const $ = cheerio.load(dadoshtml);
    const titulo = $('h1').text();
    const linkimg = $('img').attr('src');
    const datapublicacao = $('div[class="data-publicacao data-publicacao-v2"]').text();
    const texto = $('p').text();

    const dados = {titulo, linkimg, datapublicacao, texto};

    
    console.log(dados);
}   );