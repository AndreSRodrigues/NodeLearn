const http = require('http');
const express = require('express');
const bodyParser = require ('body-parser');
const path = require ('path');
const expressValidator = require('express-validator');
const util = require('util');
const mongojs = require('mongojs');
const db = mongojs('nodeAppV1', ['users']);
const ObjectId = mongojs.ObjectId;

//Inicializa a aplicação em uma variavel
var app = express();

//Setup viwe engine. Para renderizar a view pelo navegador
app.set ('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware do bodyParser. Explicado na documentação ao móulo
//Serve para lidar com a leitura e envio de arquivos json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Chamando a pasta com conteúdos estáticos. 
//Acessar pasta com conteúdos estáticos. Css, Jquery, etc
// Não utilizado por enquanto
app.use(express.static(path.join(__dirname, 'public')));

//Global Variables
app.use (function(req, res, next){
	res.locals.erros = null;
	res.locals.usuarios = null;
	next();
});

//Middleware para validação do formulário
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Get o request da página (/) 
app.get('/', (req, res) => {
	db.users.find(function (err, docs) {
		res.render('index',{
			usuarios: docs
		});
	})
});

app.post('/users/add', (req, res) =>{

	req.checkBody('name', 'Porfavor, preencha seu nome').notEmpty();
	req.checkBody('email', 'Email invalido').notEmpty();

	//Verificar o resultado da operação
	req.getValidationResult().then((result)=>{
		//PAREI AQUI!! CONTINUAR AQUI!!!
		//Ainda falta descobrir como quebrar essa string em mensagens utilizáveis
		console.log(result.array());
		errors = result.array();
		//Se o resultado tiver algo, ou seja, um erro
		if (!result.isEmpty()){
			//Tratar o erro e retornar
      		res.render('index', {
      			errors: errors
      		});
			return;
		}
		//Se não tiver erro, prosseguir
		var newUser = {
			name: req.body.name,
			email: req.body.email
		}
		db.users.insert(newUser, (err, result) =>{
			if (err){
				console.log (err);
			}
			res.redirect('/');
		})
	});
	
});

app.delete('/users/delete/:id', function(req,res){
	db.users.remove({_id: ObjectId(req.params.id)}, function(err){
		if (err){
			console.log(err);
		}
		res.redirect('/');
	});
});

app.listen(3000, () => {
	console.log ('Server started of port 3000');
});


