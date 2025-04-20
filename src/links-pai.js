const axios = require('axios');
const cheerio = require('cheerio');
const sitealvo = 'https://agenciagov.ebc.com.br/noticias';

axios.get(sitealvo).then((response) => {    
    const dadoshtml = response.data;
    
    const $ = cheerio.load(dadoshtml);
    const noticias = [];
    $('li>a').each((i,e)=>{
        const link = $(e).attr('href');
        // console.log(link);
        noticias.push(link);
        

        
        
    });
    console.log(noticias);

});