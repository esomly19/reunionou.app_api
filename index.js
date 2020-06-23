const express = require('express')
const mysql = require("mysql")
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const { Client } = require('pg')

const client = new Client({
    user: 'vozmnqeyxyofyr',
    host: 'ec2-50-17-90-177.compute-1.amazonaws.com',
    database: 'd3n7s81pra83vo',
    password: '58f72cb5058d56a3b510ad409adec2cbb288d11d303c7e584a0c0cb6403dea66',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
})

client.connect(function (err, client, done) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected!");
    }
})

// Constants
const PORT = process.env.PORT || 5000;
const HOST = "localhost";
const SERVER = "https:/warm-badlands-86536.herokuapp.com/"
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use(bodyParser.json());
app.use(cors())

const csp = require('helmet-csp')

app.use(csp({
    directives: {
        defaultSrc: [`'self'`],
        imgSrc: [`'self'`, `imgur.com`]
    },
    reportOnly: true
}))
app.listen(process.env.PORT, '0.0.0.0')
console.log(`API Running on http://${HOST}:${PORT}`)




app.get('/', function (req, res) {
    res.send('api de reunionou');
});



app.get('/user', function (req, res) {


    // connect to mysql


    $query = 'SELECT * FROM public."user" ORDER BY id ASC ';

    client.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            res.send(err);
            return;
        }
        res.json(rows.rows[0]);
        console.log("Query succesfully executed: ", rows);
    });




});

app.get('/profiluser/:id', function (req, res) {


    // connect to mysql
    let ide = req.params.id;

    $query = `SELECT * from user WHERE id = "${ide}"`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let user = {
                nom: result[0].nom,
                prenom: result[0].prenom,
                email: result[0].email
            };
            let data = {};
            data.type = "collection";
            data.user = user;
            res.status(200).send(data);

        }


    })




});

app.get('/eventuser/:id', function (req, res) {


    let ide = req.params.id;


    $query = ` SELECT * FROM 
   event WHERE iduser = "${ide}"
   `;
    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            console.log(result);
            let eventList = [];

            let event = {};
            result.forEach(lm => {
                event = {

                    id: lm.id,
                    titre: lm.titre,
                    description: lm.description,
                    date: lm.date,
                    x: lm.x,
                    y: lm.y,
                    adresse: lm.adresse,
                    etat: lm.etat,
                    token: lm.token

                }

                event.links = {
                    self: { href: `${SERVER} event / ${lm.token} ` },
                }
                eventList.push(event);
                event = {};

            });

            let data = {};
            data.type = "collection";
            data.events = eventList;

            res.status(200).send(data);

        }


    })


});
app.post("/log", (req, res) => {

    //let utilisateur = JSON.stringify(req.body);
    console.log(req.body);
    let log = req.body;
    let date_ob = new Date();
    console.log(date_ob);
    $query = `INSERT INTO logs( navigateur, plateform, date) VALUES('${log.navigateur}', '${log.plateform}', "${date_ob}")`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result >= 0) {
                res.status(404).send("problème log");
            } else {

                res.status(200).send("log enregistré");
            }
        }

    });



});

app.get("/logs", (req, res) => {
    let firefox = 0;
    let Chrome = 0;


    $query = `SELECT * FROM  logs`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result >= 0) {
                res.status(404).send("problème log");
            } else {
                result.forEach(lm => {
                    console.log(lm.navigateur);
                    if (lm.navigateur === "Chrome") {
                        Chrome++;
                    } else {
                        firefox++;
                    }



                });
                let data = {};

                data.type = "collection";
                data.chrome = Chrome;
                data.firefox = firefox;
                res.status(200).send(data);
            }
        }

    });


});

app.get("/log", (req, res) => {
    let janvier = 0;
    let fevrier = 0;
    let mars = 0;
    let avril = 0;
    let mai = 0;
    let juin = 0;
    let juillet = 0;
    let aout = 0;
    let septembre = 0;
    let octobre = 0;
    let novembre = 0;
    let decembre = 0;
    let tab = [];

    $query = `SELECT * FROM  logs`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result >= 0) {
                res.status(404).send("problème log");
            } else {
                result.forEach(lm => {

                    console.log("Date " + lm.date);
                    let ll = new Date(lm.date);
                    tab.push(ll.getMonth());
                    console.log("Mois " + ll.getMonth());




                });

                tab.forEach(tb => {
                    switch (tb) {
                        case 0:
                            janvier++;
                            break;
                        case 1:
                            fevrier++;
                            break;
                        case 2: mars++; break;
                        case 3: avril++;
                            break;
                        case 4: mai++;
                            break;
                        case 5: juin++;
                            break;
                        case 6: juillet++;
                            break;
                        case 7: aout++;
                            break;
                        case 8: septembre++;
                            break;
                        case 9: octobre++;
                            break;
                        case 10: novembre++;
                            break;
                        case 11: decembre++;
                            break;
                    }
                });
                let data = [janvier, fevrier, mars, avril, mai, juin, juillet, aout, septembre, octobre, novembre, decembre];


                res.status(200).send(data);
            }
        }

    });


});
app.get("/logevent", (req, res) => {
    let janvier = 0;
    let fevrier = 0;
    let mars = 0;
    let avril = 0;
    let mai = 0;
    let juin = 0;
    let juillet = 0;
    let aout = 0;
    let septembre = 0;
    let octobre = 0;
    let novembre = 0;
    let decembre = 0;
    let tab = [];

    $query = `SELECT * FROM  event`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result >= 0) {
                res.status(404).send("problème log");
            } else {
                result.forEach(lm => {

                    console.log("Date " + lm.date);
                    let ll = new Date(lm.date);
                    tab.push(ll.getMonth());
                    console.log("Mois " + ll.getMonth());




                });

                tab.forEach(tb => {
                    switch (tb) {
                        case 0:
                            janvier++;
                            break;
                        case 1:
                            fevrier++;
                            break;
                        case 2: mars++; break;
                        case 3: avril++;
                            break;
                        case 4: mai++;
                            break;
                        case 5: juin++;
                            break;
                        case 6: juillet++;
                            break;
                        case 7: aout++;
                            break;
                        case 8: septembre++;
                            break;
                        case 9: octobre++;
                            break;
                        case 10: novembre++;
                            break;
                        case 11: decembre++;
                            break;
                    }
                });
                let data = [janvier, fevrier, mars, avril, mai, juin, juillet, aout, septembre, octobre, novembre, decembre];


                res.status(200).send(data);
            }
        }

    });


});
//s'inscrire
app.post("/utilisateur", (req, res) => {

    //let utilisateur = JSON.stringify(req.body);
    console.log(req.body);
    let utilisateur = req.body;


    let query = `SELECT * FROM user where 'email' = "${utilisateur.email}" `
    client.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result > 0) {
                res.status(403).send("le compte existe déjà")
            } else {
                const salt = bcrypt.genSaltSync(4);
                const hash = bcrypt.hashSync(utilisateur.password, salt);
                let query2 = `INSERT INTO user (email,nom,prenom,mdp) VALUES ('${utilisateur.email}','${utilisateur.nom}','${utilisateur.prenom}','${hash}')`;

                client.query(query2, (err, result) => {
                    if (err) {
                        console.error(err);
                        res.status(404).send(err);
                    } else {
                        res.status(201).send("créer");
                    }
                })
            }
        }
    })

});



//se connecter 
app.post("/connect", (req, res) => {

    console.log(req.body);
    let utilisateur = req.body;

    $query = `SELECT * FROM user WHERE email = "${utilisateur.email}"`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result >= 0) {
                res.status(404).send("email ou mot de passe invalide");
            } else {


                if (!bcrypt.compareSync(utilisateur.password, result[0].mdp)) {
                    res.status(404).send("email ou mot de passe invalide");
                } else {

                    let e = JSON.stringify(result[0].id);
                    console.log(e);
                    res.status(200).send(e);

                }


            }


        }
    })

});



//event
app.post("/event", (req, res) => {

    //let utilisateur = JSON.stringify(req.body);

    let event = req.body;
    const salt = bcrypt.genSaltSync(4);
    const hash = bcrypt.hashSync(event.titre + event.iduser, salt);
    console.log("Date " + event.date);
    let date2 = new Date(event.date);
    date2 = date2.getUTCFullYear() + '-' +
        ('00' + (date2.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date2.getUTCDate()).slice(-2) + ' ' +
        ('00' + date2.getUTCHours()).slice(-2) + ':' +
        ('00' + date2.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date2.getUTCSeconds()).slice(-2);
    console.log(date2);
    let $query = `INSERT INTO event (titre,description,date,etat,x,y,adresse,ville,token,iduser) VALUES ('${event.titre}','${event.description}' ,'${date2}','${event.etat}','${event.x}','${event.y}','${event.adresse}','${event.ville}','${hash}','${event.iduser}')`;
    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {

            res.status(200).send("connexion accepté");

        }


    })

});
app.get("/evenenments", (req, res) => {

    //let utilisateur = JSON.stringify(req.body);


    $query = `SELECT * FROM event`;
    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {

            res.status(200).send(result);

        }


    })

});

app.get("/events", (req, res) => {

    //let utilisateur = JSON.stringify(req.body);


    $query = `SELECT * FROM event WHERE etat =1`;
    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {

            res.status(200).send(result);

        }


    })

});

app.get("/event/:token", (req, res) => {

    let tooken = req.params.token;

    $query = `SELECT * FROM event WHERE token ="${tooken}"`;
    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {

            res.status(200).send(result[0]);

        }


    })

});

app.get("/user/:id", function (req, res) {



    let id = req.params.id;

    $query = `SELECT * from user WHERE id ="${id}" `;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {

            res.status(200).send(result[0]);

        }


    })


});
app.get("/users", function (req, res) {

    let page = 1
    if (req.query.page != null && req.query.page > 0) {
        page = req.query.page
    }
    let size = 10
    if (req.query.size != null && req.query.size > 0) {
        size = req.query.size
    }


    let count = 0
    let startIndex = (page - 1) * size
    let endIndex = page * size


    $query = 'SELECT * FROM public."user" ORDER BY id ASC ';

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let userList = [];
            let user = {};
            result.rows.forEach(lm => {
                user = {
                    id: lm.id,
                    email: lm.email,
                    nom: lm.nom,
                    prenom: lm.prenom
                }
                user.links = {
                    self: { href: `${SERVER} users / ${lm.id} ` },
                }
                userList.push(user);
                user = {};
                count++;
            });
            let nbpage = Math.ceil(count / size)
            if (page > nbpage) {
                page = nbpage
                startIndex = (page - 1) * size
                endIndex = page * size
            }
            let data = {};
            data.type = "collection";
            data.count = count;

            data.nbpage = nbpage;
            if (startIndex > 0) {
                let previous = SERVER + "users?page=" + parseInt(parseInt(page) - 1) + "&size=" + size;
                data.previous = previous;
            }

            if (endIndex < count) {
                let next = SERVER + "users?page=" + parseInt(parseInt(page) + 1) + "&size=" + size;
                data.next = next;
            }
            data.users = userList.slice(startIndex, endIndex);
            res.json(data);

        }


    })


});


app.get("/eventadmin", function (req, res) {

    let page = 1
    if (req.query.page != null && req.query.page > 0) {
        page = req.query.page
    }
    let size = 10
    if (req.query.size != null && req.query.size > 0) {
        size = req.query.size
    }


    let count = 0
    let startIndex = (page - 1) * size
    let endIndex = page * size


    $query = `SELECT * from event  ORDER BY id ASC `;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let eventList = [];
            let event = {};
            result.forEach(lm => {
                event = {
                    id: lm.id,
                    titre: lm.titre,
                    description: lm.description,
                    date: lm.date,
                    x: lm.x,
                    y: lm.y,
                    adresse: lm.adresse,
                    etat: lm.etat,
                    token: lm.token,
                    iduser: lm.iduser
                }
                event.links = {
                    self: { href: `${SERVER} event / ${lm.token} ` },
                }
                eventList.push(event);
                event = {};
                count++;
            });
            let nbpage = Math.ceil(count / size)
            if (page > nbpage) {
                page = nbpage
                startIndex = (page - 1) * size
                endIndex = page * size
            }
            let data = {};
            data.type = "collection";
            data.count = count;

            data.nbpage = nbpage;
            if (startIndex > 0) {
                let previous = SERVER + "eventadmin?page=" + parseInt(parseInt(page) - 1) + "&size=" + size;
                data.previous = previous;
            }

            if (endIndex < count) {
                let next = SERVER + "eventadmin?page=" + parseInt(parseInt(page) + 1) + "&size=" + size;
                data.next = next;
            }
            data.events = eventList.slice(startIndex, endIndex);
            res.status(200).send(data);

        }


    })


});

app.get("/participants/:token", function (req, res) {



    let token = req.params.token;

    $query2 = `SELECT id from event WHERE token = "${token}" `;

    client.query($query2, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let idd = result[0].id;
            console.log(result[0].id);
            $query = `SELECT * from participe WHERE idevent = "${idd}" `;

            client.query($query, (err, result2) => {

                if (err) {
                    console.error(err);
                    res.status(404).send(err);
                } else {
                    console.log(result2);
                    res.status(200).send(result2);

                }


            })
        }

    })
});


app.post("/participe", (req, res) => {
    let token = req.body.token;
    console.log("token " + token);
    let id;
    $query2 = `SELECT id from event WHERE token = "${token}" `;

    client.query($query2, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            console.log(result[0].id);
            id = result[0].id;
            let event = req.body;

            let $query = `INSERT INTO participe(idevent, nom) VALUES('${id}', '${event.nom}')`;
            client.query($query, (err, result) => {

                if (err) {
                    console.error(err);
                    res.status(404).send(err);
                } else {

                    res.status(200).send("connexion accepté");

                }


            });
        }


    });
});

app.get("/commentaires/:token", function (req, res) {



    let token = req.params.token;

    $query2 = `SELECT id from event WHERE token = "${token}" `;

    client.query($query2, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let idd = result[0].id;
            console.log(result[0].id);
            $query = `SELECT * from commentaires WHERE idevent = "${idd}" `;

            client.query($query, (err, result2) => {

                if (err) {
                    console.error(err);
                    res.status(404).send(err);
                } else {
                    console.log(result2);
                    res.status(200).send(result2);

                }


            })
        }

    })
});

app.post("/comment", (req, res) => {
    let token = req.body.token;
    console.log("token " + token);
    let id;
    $query2 = `SELECT id from event WHERE token = "${token}" `;

    client.query($query2, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            console.log(result[0].id);
            id = result[0].id;
            let event = req.body;

            let $query = `INSERT INTO commentaires(idevent, nom, commentaire) VALUES('${id}', '${event.nom}', '${event.commentaire}')`;
            client.query($query, (err, result) => {

                if (err) {
                    console.error(err);
                    res.status(404).send(err);
                } else {

                    res.status(200).send("connexion accepté");

                }


            });
        }


    });
});
app.put('/event/:id', (req, res) => {
    res.type("application/json;charset=utf-8");

    let id = req.params.id;
    let event = req.body;
    const salt = bcrypt.genSaltSync(4);
    const hash = bcrypt.hashSync(event.titre + event.iduser, salt);
    console.log("Date " + event.date);
    let date2 = new Date(event.date);
    date2 = date2.getUTCFullYear() + '-' +
        ('00' + (date2.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date2.getUTCDate()).slice(-2) + ' ' +
        ('00' + date2.getUTCHours()).slice(-2) + ':' +
        ('00' + date2.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date2.getUTCSeconds()).slice(-2);
    console.log(date2);



    //(titre,description,date,etat,x,y,adresse,token,iduser) VALUES ('${event.titre}','${event.description}' ,'${date2}','${event.etat}','${event.x}','${event.y}','${event.adresse}','${hash}','${event.iduser}')`
    let query = `UPDATE event SET titre = "${event.titre}", description= '${event.description}', date = "${date2}",etat = "${event.etat}", x= '${event.x}', y = "${event.y}" , adresse = "${event.adresse}"WHERE id= "${id}" `;

    client.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(404).send(err);
        }
        if (result.affectedRows == 0) {
            console.log("La commande " + req.params.id + " est inexistante");
            res.status(404).json({ "type": "error", "error": 404, "message": "Ressource non disponible : " + req._parsedUrl.pathname });
        } else {
            res.status(201).send(JSON.stringify({ message: "update reussi sur event n°" + id, serie: req.body }));
        }
    });

});

app.get("/nbconnect", (req, res) => {
    let token = req.body.token;
    console.log("token " + token);
    let id;
    $query2 = `SELECT id from event WHERE token = "${token}" `;

    client.query($query2, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            console.log(result[0].id);
            id = result[0].id;
            let event = req.body;

            let $query = `INSERT INTO commentaires(idevent, nom, commentaire) VALUES('${id}', '${event.nom}', '${event.commentaire}')`;
            client.query($query, (err, result) => {

                if (err) {
                    console.error(err);
                    res.status(404).send(err);
                } else {

                    res.status(200).send("connexion accepté");

                }


            });
        }


    });
});
/*
let client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reunionou'
});


function startConnection() {
    console.error('CONNECTING');
    client = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'reunionou'
    });
    console.log(client)
    client.connect(function (err) {
        if (err) {
            console.error('CONNECT FAILED', err.code);
            startConnection();
        }
        else
            console.error('CONNECTED');
    });
    client.on('error', function (err) {
        if (err.fatal)
            startConnection();
    });
}

*/