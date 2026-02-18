const express = require("express"); //On fait un appel du module node.js 'express", mais j'aime souvent dire "de l'outil node.js, express"
const adminMiddleware = require("../middlewares/adminMiddleware"); //De même pour le middleware...
const adminController = require("../controllers/adminController"); //...Et pour le controller admin !

const router = express.Router(); //On crée une instance, ou encore : on instancie une nouvelle route grace à express

router.get("/users", adminMiddleware, adminController.getAllUsers); //On définit la route get, qui permet de récupérer tous les user en dehors de l'admin
router.delete("/user/:id", adminMiddleware, adminController.deleteUser); //On définit aussi une route qui permet de supprimer un user en particulier

module.exports = router; //On exporte tous ça, sur l'alias "router"
