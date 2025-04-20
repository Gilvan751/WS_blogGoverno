const axios = require('axios');
const cheerio = require('cheerio');
const urlpai = 'https://agenciagov.ebc.com.br/noticias';

axios.get(urlpai).then((response) => {    
    const dadoshtml = response.data;
    
    const $ = cheerio.load(dadoshtml);
    const dados = [];
    $('li>a').each((i,e)=>{
        const link = $(e).attr('href');
        // console.log(link);
        dados.push(link);
        

        
        
    });
    console.log(dados);

});