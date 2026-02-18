const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const usuarios = [];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8'); // Preciso passar o header 

  if (req.url === '/' && req.method === 'GET') { // If simples, para verificar o metódo utilizado
    res.statusCode = 200;

    const dadosResposta = {
      message: 'Página principal funcionando.',
      status: 'OK', // http status code 200 
    };

    return res.end(JSON.stringify(dadosResposta));
  }

  if (req.url === '/' && req.method != 'GET') {
    res.statusCode = 405;
    return res.end(JSON.stringify({
      message: 'Rota indiponível para esse tipo de requisição HTTP',
      status: 'Method Not Allowed', // http status code 405
    }));
  }

  if (req.url === '/criar' && req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({
      message: 'Rota indisponível para esse tipo de requisição HTTP',
      status: 'Method Not Allowed',
    }));
  }

  if (req.url === '/criar' && req.method === 'POST') {
    let body = '';

    req.on('data', (dadosEmPedacos) => {
      body += dadosEmPedacos.toString();
    });

    return req.on('end', () => {
      const dadosRecebidos = JSON.parse(body);
      usuarios.push(dadosRecebidos);
      res.statusCode = 201; // status de created
      return res.end(JSON.stringify({
        message: "Usuário criado com sucesso!",
        dadosRecebidos, // como abrir esse objeto e escolher os dados que forem enviados?
        status: "Created",
      }));
    })
  }

  if (req.url === '/status' && req.method === 'GET') {
    res.statusCode = 200;

    return res.end(JSON.stringify({
      message: "Servidor online.",
      status: "OK",
    }))
  }

  if (req.url === '/info' && req.method === 'GET') {
    res.statusCode = 200;

    return res.end(JSON.stringify({
      title: "API raíz com JS apenas",
      message: "Versão: 1.0",
      author: "Lucassss",
      citacao: "A vida é curta, então, curta!!"
    }))
  }

  if (req.url === '/data' && req.method === 'GET') {
    res.statusCode = 200;

    const date = new Date()
    return res.end(JSON.stringify({
      message: `Data atual: ${date}`
    }))
  }

  if (req.url === '/echo' && req.method === 'POST') {
    let body = '';

    req.on('data', (mensagemRecebida) => {
      body += mensagemRecebida.toString();
    });

    return req.on('end', () => {
      const mensagemRepetida = JSON.parse(body);

      if (mensagemRepetida.name) {
        res.statusCode = 200;
        return res.end(JSON.stringify({
          nomeRepetido: mensagemRepetida.name
        }));
      }
      if (!mensagemRepetida.name) {
        res.statusCode = 200;
        return res.end(JSON.stringify({
          message: mensagemRepetida
        }))
      };
    })
  }

  if (req.url === '/deletar' && req.method === 'DELETE') {
    res.statusCode = 200;

    debugger;

    usuarios.length = 0;

    return res.end(JSON.stringify({
      message: "Todos os usuários foram deletados!"
    }))
  };

  if (req.url.startsWith('/deletar/') && req.method === 'DELETE') {
    const partesUrl = req.url.split('/');
    const idUrl = partesUrl[2];

    const idUsuario = usuarios.findIndex(usuario => usuario.id === Number(idUrl));

    if (idUsuario === -1) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "Usuário não encontrado." }));
    }

    usuarios.splice(idUsuario, 1);

    res.statusCode = 200;
    return res.end(JSON.stringify({
      message: `O usuário de ID ${idUrl} foi deletado com sucesso!`
    }));
  }

  if (req.url === '/usuarios' && req.method === 'GET') {

    const quantUsuarios = usuarios.length; // nao colocar a zorra do (), pois o length é metodo NAO é função 
    const apenasNomes = usuarios.map(usuario => usuario.name);

    res.statusCode = 200;
    return res.end(JSON.stringify({
      quantidadeUsuarios: quantUsuarios,
      listaDeUsuarios: usuarios,
      nomesExtraidos: apenasNomes,
    }))
  };

  res.statusCode = 404;
  return res.end(JSON.stringify({
    message: "Caminho não encontrado!",
    status: 'Not Found',// http status code 404
  }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
}); 