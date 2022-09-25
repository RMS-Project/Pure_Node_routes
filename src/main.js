import { createServer } from 'http'

// ---------------------- Server and routes ----------------------

const server = createServer((request, response) => {
  const routes = {
    '/': () => {
      pageHome(request, response)
    },
    '/status': () => {
      pageStatus(request, response)
    }
  }

  if(!routes[request.url]) {
    invalidRoutes(request, response)
    return
  }

  routes[request.url]()
})

// Configurar porta e hostname - Via variável de ambiente
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

// Configura o Hostname, caso não tenha um definido, utiliza o 
// padrão 127.0.0.1.
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1'

server.listen(3000, '127.0.0.1', () => {
  console.log(`Server in listening at http://${HOSTNAME}${PORT}`)
})

// ---------------------- Functions routes ----------------------

// Retorna texto
function pageHome(request, response) {
  response.writeHead(200)
  response.write('Home')
  response.end()
}

// Retorna JSON
function pageStatus(request, response) {
  response.writeHead(200, {
    'Content-Type': 'application/json'
  })

  response.write(
    JSON.stringify({
      status: 'Status'
    })
  )
  response.end()
}

function invalidRoutes(request, response) {
  response.writeHead(404)
  response.write('This page does not exist!')
  response.end()
}