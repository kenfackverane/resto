const mongoose = require("mongoose"); //On fait appel à mongoose, un outil mongoDB-node.js qui permet de manipuler les databases mongoDB depuis un serveur js

const userSchema = new mongoose.Schema( //Ici, on utilise la méthode Schema pour créer des schéma de données : pour mieux comprendre regarde dans Doc/Schema.gif
  { //On as ici le formatage BSON
    name: { //le nom de l'user
      type: String, //de type chaine de caractères
      trim: true,
      required: true, //Pour dire que cette donnée est obligatoire
    },
    email: { //l'adresse e-mail de l'user
      type: String, //de type chaine de caractères
      trim: true,
      required: true, //Pour dire que cette donnée est obligatoire
    },
    password: { //son mot de passe (qui sera "haché" par l'outil bcrypt de node.js)
      type: String, //de type chaine de caractères
      required: true, //Pour dire que cette donnée est obligatoire
    },
    role: { //le role de l'user : s'il est client ou administrateur(le boss de boite / le patron)
      type: String, //de type chaine de caractères
      enum: ["user", "admin"], //On as prédéfini la valeur de cette donnée (role) sur soit "user" ou "admin", comme je l'ai mentioné plus haut !
      default: "user", //Et par défaut, on as laissé sur "user" : ce qui veut dire que toute personne qui arrive est automatiquement client !
    },
    address: { //l'adresse de l'user (par exemple: New-bell, Doula, 2115Dla), mais à priorie, il semblerait que cette donnée ne soit pas obligatoire : l'user n'est pas obligé de le renseigné !
      type: String, //de type chaine de caractères
    },
  },
  { timestamps: true } //Pour permettre à mongoose de renseigner de plus, la date de "création" du document (createAt) et la dernière date de "modification" du document (updateAt)
);

module.exports = mongoose.model("user", userSchema); //On indique à mongoose que cette structure ci (userSchema), sera la structure de tous les documents qui se trouvent dans la collection "user"


//EXPLICATION : Un Schema c'est en quelque sorte, la structure de ton document, par exemple, pour le cas de la collection "user", d'une autre façon, tu peux aussi appeler cela : "la table user". Et ensuite, nous savons que dans une table, on as une serie de valeurs (en mysql, c'est parfois Name="Verane", Age=21 etc..), mais en mongoDB, une valeur dans le tableau correspond à un sous-taleau de valeurs (c'est-à-dire qu'au lieu de cela, tu verras {Name:"verane", Age: 18}), ce sous-tableau là, est ce qu'on appelle "document" dans l'expression mongoDB. Ainsi, quand tu veux stocker une serie de valeurs dans ce document, tu doit établir à l'avance la structure de ton document, ce qui vas indiquer à mongoose comment il y iras insérer et arranger ces valeurs dans un document spécifique (parce que chaque document à un id unique crée automatique via mongoDB, appelé "_id"). NOTE: la structure (le Schema) d'un document peut avoir l'air d'etre un JSON, mais en réalité, on appelle cela du "BSON"