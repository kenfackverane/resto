const mongoose = require("mongoose"); //On fait appel à mongoose, un outil mongoDB-node.js qui permet de manipuler les databases mongoDB depuis un serveur js

const connectDatabase = () => { //On crée la fonction de connection à notre database
  mongoose //qui veut dire en un deux mots : "via mongoose..."
    .connect(process.env.DB) //"...je me connecter à cette database, indiqué dans le fichier .env sur le paramètre, DB"
    .then(() => { //"...Et si c'est ok, alors..."
      console.log("Database is successfully connected"); //"...prévient moi, que : oui, la connection as été éffectué !..."
    })
    .catch((err) => { //"...Mais si ce n'est pas le cas, alors..."
      console.log(err); //"...montre moi où se trouve l'érreur !"
    });
};

module.exports = connectDatabase; //Puis, on exporte tous cela, sur l'alias "connectDatabase"
