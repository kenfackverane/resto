const User = require("../models/userModel"); //On fait un appel userModel
const bcrypt = require("bcrypt"); //On fait un appel d'un outil de cryptage node.js, (appeler "bcrypt")

module.exports = async (req, res, next) => {
  try {
    const { email, password } = req.headers; //On récupère les informations(email, password) depuis le header requête client

    if (!email || !password) { //On vérifie si les champs sont valides (s'ils ne sont pas vide !)
      return res.status(401).json({ message: "Identifiants manquants" }); //Si c'est le cas, pas de suite du process : on fait un return qui vas signaler à l'utilisateur le problème
    }

    const user = await User.findOne({ email }); //On utilise une fonction mongoDB-nodejs permettant de rechercher dans la liste des documents de la collection "user", un document spécifique qui contient comme information, l'email que nous avons indiqué !
    if (!user) { //On vérifie si on as trouvé ce document spécifique (si ce que nous renvoie la constante "user" en retour n'est pas vide)
      return res.status(401).json({ message: "Utilisateur introuvable" }); //Si c'est le cas, on signale qu'on as rien trouvé ! 
    }

    const isMatch = await bcrypt.compare(password, user.password); //Ici, grace à l'outil de cryptographie node-js, appeler "bcrypt", on compare le password venue de la requête client avec celui qu'on as en database(mongoDB) : cette fonction await bcrypt.compare(...) vas d'abord décrypter le password qu'on as en database(mongoDB) parce qu'il est "haché" (ce qui veut dire qu'il est protégé par un système d'encodage de caractères grace à bcrypt qui le rend illisibe en database par l'oeuil humain)
    if (!isMatch) { //On vérifie si cette comparaison, nous affirme que les deux password sont similaires (si ce  que nous renvoie la constante isMatch, n'est pas vide)
      return res.status(401).json({ message: "Mot de passe incorrect" }); //Si c'est le cas, on signale que le password est faux
    }

    if (user.role !== "admin") { //On vérifie si le role de l'user est sur Admin
      return res.status(403).json({ message: "Accès admin uniquement" }); //Si ce n'est pas le cas, on l'interdit de passer
    }

    //req.admin = user; // admin authentifié
    next();
  } catch (error) { //Cette fonction permet de surveiller, des erreurs lors du try{...}
    res.status(500).json({ message: "Erreur serveur" }); //si lors de tous ces étapes, un problème quelconque survient, on informe le plutot possible !
  }
};
