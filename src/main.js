import { createServer } from 'http'

// fs - Biblioteca para sistema de arquivos.
// readFile - Le arquivos de forma assíncrona.
import { readFile } from 'fs'

// path - Lida com caminhos de arquivos
// revolve - Obtém o caminho relativo.
import { resolve } from 'path'

// decodificar os dados vindos por POST
import { parse } from 'querystring'

// ---------------------- Server and routes ----------------------

const server = createServer((request, response) => {
  const routes = {
    
    '/': () => { homePage(request, response) },

    '/status': () => { statusPage(request, response) },

    '/sign-in': () => { pageSingIn(request, response) },

    '/authenticate': () => { performAuthentication(request, response) },

    '/home': () => { homePageAuthenticate(request, response) }
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
function homePage(request, response) {
  response.writeHead(200)
  response.write('Home')
  response.end()
}

// Retorna JSON
function statusPage(request, response) {
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

// Retorna um arquivo HTML
function pageSingIn(request, response) {
  // __dirname - Injeta o caminho completo para o arquivo. 
  const path = resolve(__dirname,'./pages/sign-in.html')

  readFile(path, (error, file) => {
    if (error) {
      response.writeHead(500, "Can\'t process HTML file.")
      response.end()
      return
    }

    response.writeHead(200)
    response.write(file)
    response.end()
  })
}

// Realiza a autenticação de um usuário.
function performAuthentication(request, response) {
  let data = ''

  // Patterns de evento.
  // Vai ler o buffer aos poucos.
  request.on('data', (chunk) => {
    data += chunk
  })

  request.on('end',() => {
    let params = parse(data)

    // AQUI ENTRA A AUTENTICAÇÃO NO BANCO

    // Caso seja valido redireciona para página com 
    // necessidade de autenticação.
    response.writeHead(301, {
      Location: 'home'
    })
    response.end()
  })
}

// Retorna um arquivo HTML
function homePageAuthenticate(request, response) {
  // __dirname - Injeta o caminho completo para o arquivo. 
  const path = resolve(__dirname,'./pages/home.html')

  readFile(path, (error, file) => {
    if (error) {
      response.writeHead(500, "Can\'t process HTML file.")
      response.end()
      return
    }

    response.writeHead(200)
    response.write(file)
    response.end()
  })
}

function invalidRoutes(request, response) {
  response.writeHead(404)
  response.write('This page does not exist!')
  response.end()
}