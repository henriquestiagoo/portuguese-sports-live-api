const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'abola',
        address: 'https://www.abola.pt/Nnh/Noticias',
        base: 'https://www.abola.pt/'
    },
    {
        name: 'record',
        address: 'https://www.record.pt/ultimas-noticias?ref=Masterpage_MenuDestaque',
        base: 'https://www.record.pt'
    },
    {
        name: 'ojogo',
        address: 'https://www.ojogo.pt/ultimas.html',
        base: 'https://www.ojogo.pt/'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)

        if (newspaper.name == "abola") {
            $('.media.mt-15', html).each(function() {
                const title = $(this).find('.media-heading').text().trim()
                const url = $(this).find('.media-body').find('a').attr('href')
    
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
            
        } else if (newspaper.name == "record") {
            $('.col-12.destaques.showPicture.destaques', html).each(function() {
                const title = $(this).find('.noticia_box').find('h1').text().trim()
                const url = $(this).find('.noticia_box').find('a').attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        
        } else if (newspaper.name == "ojogo") {
            $('.t-g1-l1-m1', html).each(function() {
                const title = $(this).find('h2').find('a').text().trim()
                const url = $(this).find('h2').find('a').attr('href')
    
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        } 
        
    }).catch((error) => console.log(error))
})

app.get('/', (req, res) => {
    res.json('Welcome to my Portuguese Live Sports API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId;
    res.json(articles.filter(({ source }) => source === newspaperId));  
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))