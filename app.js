const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantsData = require('./restaurant.json')
const restaurants = restaurantsData.results
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('./public'))

//主頁面路由
app.get('/', (req, res) => {
  res.render('index', ({ restaurants }))
})
//餐廳介紹路由
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id)
  res.render('show', ({ restaurant }))
})
//餐廳類別路由
app.get('/category/:category', (req, res) => {
  const category = restaurants.filter((restaurant) => restaurant.category === req.params.category)
  res.render('index', ({ restaurants: category }))
})
//搜尋路由
app.get('/search', (req, res) => {
  renderSearchResult(req, res)
})
// 啟動、監聽伺服器
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

function renderSearchResult(req, res) {
  const keyword = req.query.keyword.replace(/ /g, '')
  // const searchListByName = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()))
  // const searchListByCategory = restaurants.filter(restaurant => restaurant.category.toLowerCase().includes(keyword.toLowerCase()))
  // const searchList = searchListByName.length ? searchListByName : searchListByCategory
  const searchList = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase()))
  //若搜尋不到餐廳帶入no-found頁面
  if (searchList.length === 0) {
    res.render('no-found', ({ keyword }))
  } else {
    res.render('index', ({ restaurants: searchList, keyword }))
  }
}
