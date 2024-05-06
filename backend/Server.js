const express = require("express"); // Importation du module express qui permet d'accéder à express     
const cors = require("cors"); // Importation du module cors permettant au back et au front d'échanger des données
const mysql = require("mysql"); // Importation du module mysql pour communiquer avec la base de donnée
const app = express(); // Création d'une instance de l'application express permet d'utiliser les méthodes de l'objet express dans la variable "app"

const corsOptions = { // Options CORS pour définir les paramètres de sécurité des requêtes cross-origin 
    origin: [ // C'est un tableau qui spécifie les origines URL autorisées à accéder au serveur. Cela signifie que les applications hébergées sur ces domaines peuvent faire des requêtes cross-origin vers votre serveur
    
        'http://localhost:3000',
        'http://localhost:8081',
    ],
    optionsSuccessStatuts: 200,
    methods:  "GET,HEAD,PUT,PATCH,POST,DELETE",
    headers: 'Content-Type, Authorization',
    credentials: true,
}

app.use(express.json()); // Middleware pour permettre à l'application d'interpréter les données envoyées par les formulaires ou les API
app.use(cors(corsOptions)); // Middleware pour ajouter les paramètres de sécurité pour les requêtes cross-origin

const database = mysql.createConnection({ // Connexion à la base de données MySQL
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crudnode' 
})

app.get("/", (req,res) => { // Définition d'un endpoint pour la racine de l'application
    const sql = "SELECT * FROM student"; // Requête SQL pour récupérer toutes les informations des étudiants
    database.query(sql, (err, data) => { // Exécution de la requête SQL
        if (err) return res.json("Error"); // Gestion des erreurs
        return res.json(data); // Renvoi des données au format JSON
    })
})

app.listen(8081, () => { // Démarrage du serveur sur le port 8081
    console.log('Serveur is running on port 8081');
})

app.post("/create", (req,res) => { // Définition d'un endpoint pour créer un nouvel étudiant
    const sql = "INSERT INTO student (`name`, `email`) VALUE (?)"; // Requête SQL pour insérer un nouvel étudiant dans la base de données
    const values = [
        req.body.name, // Récupération du nom de l'étudiant depuis la requête HTTP
        req.body.email // Récupération de l'email de l'étudiant depuis la requête HTTP
    ] 

    database.query(sql, [values], (err, data) => { // Exécution de la requête SQL
        if (err) return res.json("Error"); // Gestion des erreurs
        return res.json(data); // Renvoi des données au format JSON
    })
})

app.put(`/update/:id`, (req,res) => { // Définition d'un endpoint pour mettre à jour les informations d'un étudiant
    const sql = "UPDATE student set `name` = ?, `email` = ? WHERE id = ?"; // Requête SQL pour mettre à jour les informations de l'étudiant
    const values = [
        req.body.name, // Récupération du nouveau nom de l'étudiant depuis la requête HTTP
        req.body.email // Récupération du nouvel email de l'étudiant depuis la requête HTTP
    ] 
    const id = req.params.id; // Récupération de l'identifiant de l'étudiant depuis les paramètres de l'URL

    database.query(sql, [...values, id], (err, data) => { // Exécution de la requête SQL
        if (err) return res.json("Error"); // Gestion des erreurs
        return res.json(data); // Renvoi des données au format JSON
    })
})
