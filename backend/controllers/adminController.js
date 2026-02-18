const User = require("../models/userModel"); //On fait un appel userModel

//Ceci ce sont des méthodes qui vont être utiliser (voila pourquoi tu verras "exports.get...")

exports.getAllUsers = async (req, res) => { //Celui vas se charger d'attendre en paramètres, "une requête de l'user envoyée" et "une réponse du serveur rétournée"
  const users = await User.find().select("-password"); //On vas recherher tous les documents dans la collection "user" qui ont dans leur série de valeurs, une donnée "password". NOTE: Cette recherche est possible via la fonction de mongoose ".find().select('...')"
  res.json(users); //Dès que c'est fait, on vas dire au serveur de répondre : en gros, de lister le resultat de notre recherche !
};

exports.deleteUser = async (req, res) => { //Celui est aussi chargé d'attendre en paramètres, "une requête de l'user envoyée" et "une réponse du serveur rétournée"
  const action = await User.findByIdAndDelete(req.params.id); //On vas chercher chercher cette fois ci, dans la collection "user", un document qui à pour id, celui de l'user et le supprimé (comment ? : tout simplement en récupérant l'id stocké discrtement en cookie dans le navigateur de l'user. C'est ainsi que lorsque l'user fait une requète, on peut aller fouiller dans les paramètres de sa requête et récupérant notr id gardé en mémoire. Dans le code, on le voit via "req.params.id"). NOTE: Cette recherche est possible via la fonction de mongoose ".findByIdAndDelete('...')"
  if(action != null) {
  res.json({ message: "Utilisateur supprimé !" }); //Dès que c'est fait, on vas dire au serveur de répondre : en gros, de signaler que c'est bon, on as trouvé et supprimé le document (l'user spécifié) !
  } else {
  res.json({ message: "Utilisateur non-trouvé !" });
  }
};
