const jsonServer = require('json-server')
const path = require("path")

let server = jsonServer.create()
let router = jsonServer.router(path.join(__dirname, "mock-data", "mock-db.json"));
let middlewares = jsonServer.defaults()

router.render = function (req, res) {
  res.jsonp(Object.assign({respnseCode: 200}, res.locals.data))
}

server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', function (req, res) {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next()
})

// Use default router
server.use(router)
server.listen(3002, function () {
  console.log('JSON Server is running on port 3002')
})
