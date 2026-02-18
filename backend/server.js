const express = require("express"); //------------------------
const cors = require("cors"); //                             |
const bodyParser = require("body-parser"); //                |----> (Importations de modules node.js (js, express, cors, body-parser), et de la function de connection à notre database (connectDatabase))
const { readdirSync } = require("fs"); //                    |
const connectDatabase = require("./utils/database"); //-------

const app = express(); //On se base sur express pour créer l'app (le seveur backend)

require("dotenv").config(); //via l'importation dotenv, on permet à tous nos fichiers de pourvoir retrouver un élément qu'ils ont besoin dans notre ficher .env 

connectDatabase(); //On se connecte à notre database mongoDB

app.use(bodyParser.json()); //On initie (ou encore on "prévient" node.js, comme j'aime souvent le dire !), l'utilisation du module bodyParser et spécifiquement sa méthode .json() 
app.use(cors()); //De même, on initie l'utilisation du module cors 

const session = require("express-session"); //Demarage de la session de base
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 // 1 heure
    }
  })
);


readdirSync("./routes").map((r) => { //On établit nos routes sur une branche, appelée "api"
  app.use("/api", require(`./routes/${r}`));
});

const port = process.env.PORT || 5000; //Le port du serveur, soit 5000, soit celui du fichier .env

app.get('/', (req, res) => { //Ici, on crée une page de reconnaissance visuelle !
  res.send('😉 Hello from resto server !');
});

app.get('/image/', (req, res) => {
  res.sendfile("./image.png");
})

app.listen(port, () => { // On démarre le serveur ici !
  console.log(`Server is running on port: ${port}`);
});
