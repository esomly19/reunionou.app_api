const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const { Client } = require('pg')

const client = new Client({
    user: 'jnepbfgzqcwcvn',
    host: 'ec2-52-22-216-69.compute-1.amazonaws.com',
    database: 'd60o9nrd1mmq51',
    password: '78c31a017d11456fc5707aadba218690694792157eeb5f2fe3e18c8fe9c263c4',
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
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.use(cors())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}






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
        res.json(rows.rows);
        console.log("Query succesfully executed: ", rows);
    });




});

app.get('/profiluser/:id', function (req, res) {


    // connect to mysql
    let ide = req.params.id;
    console.log("id " + req.params.id);
    $query = `SELECT * from public."user" WHERE id = '${ide}'`;
    console.log($query);
    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let user = {
                nom: result.rows[0].nom,
                prenom: result.rows[0].prenom,
                email: result.rows[0].email
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
   public."event" WHERE iduser = '${ide}'
   `;
    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            console.log(result.rows);
            let eventList = [];

            let event = {};
            result.rows.forEach(lm => {
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
    $query = `INSERT INTO public."logs"( navigateur, plateform, date) VALUES('${log.navigateur}', '${log.plateform}', '${date_ob}')`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {


            res.status(200).send("log enregistré");

        }

    });



});

app.get("/logs", (req, res) => {
    let firefox = 0;
    let Chrome = 0;
    let autre = 0;


    $query = `SELECT * FROM  public."logs"`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result.rows >= 0) {
                res.status(404).send("problème log");
            } else {
                result.rows.forEach(lm => {
                    console.log("Navigateur  lol " + lm.navigateur);
                    if (lm.navigateur === "Chrome") {
                        Chrome++;
                    } else if (lm.navigateur === "Firefox") {
                        firefox++;
                    } else {
                        autre++;
                    }



                });
                let data = {};

                data.type = "collection";
                data.chrome = Chrome;
                data.firefox = firefox;
                data.autre = autre;
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

    $query = `SELECT * FROM  public."logs"`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result.rows >= 0) {
                res.status(404).send("problème log");
            } else {
                result.rows.forEach(lm => {

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

    $query = `SELECT * FROM  public."event"`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result.rows >= 0) {
                res.status(404).send("problème log");
            } else {
                result.rows.forEach(lm => {

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

    let utilisateur = JSON.stringify(req.body);


    let objUtilisateur = JSON.parse(utilisateur);
    console.log("OBJ : " + objUtilisateur.nom);
    console.log("pre : " + objUtilisateur.prenom);

    let query = `SELECT * FROM public."user"  where email = '${objUtilisateur.email}' `;


    client.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result.rows > 0) {
                res.status(403).send("le compte existe déjà")

            } else {

                const salt = bcrypt.genSaltSync(4);
                const hash = bcrypt.hashSync(objUtilisateur.password, salt);
                let query2 = `INSERT INTO public."user" (email,nom,prenom,mdp) VALUES ('${objUtilisateur.email}','${objUtilisateur.nom}','${objUtilisateur.prenom}','${hash}')`;

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


    let query = `SELECT * FROM public."user"  where email = '${utilisateur.email}' `;

    client.query(query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            if (result.rows >= 0) {
                res.status(404).send("email ou mot de passe invalide");
            } else {


                if (!bcrypt.compareSync(utilisateur.password, result.rows[0].mdp)) {
                    res.status(404).send("email ou mot de passe invalide");
                } else {
                    let data = {};
                    data.nom = JSON.stringify(result.rows[0].nom);
                    data.prenom = JSON.stringify(result.rows[0].prenom);

                    let e = JSON.stringify(result.rows[0].id);
                    data.id = e;
                    console.log(e);
                    res.status(200).send(result.rows[0]);

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
    let $query = `INSERT INTO public."event" (titre,description,date,etat,x,y,adresse,ville,token,iduser) VALUES ('${event.titre}','${event.description}' ,'${date2}','${event.etat}','${event.x}','${event.y}','${event.adresse}','${event.ville}','${hash}','${event.iduser}')`;
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


    $query = `SELECT * FROM public."event"`;
    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {

            res.status(200).send(result.rows);

        }


    })

});

app.get("/events", (req, res) => {
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

    let date2 = new Date();
    date2 = date2.getUTCFullYear() + '-' +
        ('00' + (date2.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date2.getUTCDate()).slice(-2) + ' ' +
        ('00' + date2.getUTCHours()).slice(-2) + ':' +
        ('00' + date2.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date2.getUTCSeconds()).slice(-2);
    console.log(date2);
    $query = `SELECT * FROM public."event" WHERE etat =0 AND  date > '${date2}'`;
    console.log($query);
    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let eventList = [];
            let event = {};
            result.rows.forEach(lm => {
                event = {
                    id: lm.id,
                    token: lm.token,
                    titre: lm.titre,
                    description: lm.description,
                    date: lm.date,
                    etat: lm.etat,
                    x: lm.x,
                    y: lm.y,
                    adresse: lm.adresse,
                    ville: lm.ville,
                    iduser: lm.iduser,
                }
                event.links = {
                    self: { href: `${SERVER} event / ${lm.id} ` },
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
                let previous = SERVER + "events?page=" + parseInt(parseInt(page) - 1) + "&size=" + size;
                data.previous = previous;
            }

            if (endIndex < count) {
                let next = SERVER + "users?page=" + parseInt(parseInt(page) + 1) + "&size=" + size;
                data.next = next;
            }
            data.events = eventList.slice(startIndex, endIndex);

            res.status(200).json(data);

        }


    })

});

app.get("/events/:name", (req, res) => {
    let name = req.params.name;
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

    let date2 = new Date();
    date2 = date2.getUTCFullYear() + '-' +
        ('00' + (date2.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date2.getUTCDate()).slice(-2) + ' ' +
        ('00' + date2.getUTCHours()).slice(-2) + ':' +
        ('00' + date2.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date2.getUTCSeconds()).slice(-2);
    console.log(date2);
    $query = `SELECT * FROM public."event" WHERE etat =0 AND  date > '${date2}' AND titre LIKE '%${name}%' `;
    console.log($query);
    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let eventList = [];
            let event = {};

            result.rows.forEach(lm => {
                event = {
                    id: lm.id,
                    token: lm.token,
                    titre: lm.titre,
                    description: lm.description,
                    date: lm.date,
                    etat: lm.etat,
                    x: lm.x,
                    y: lm.y,
                    adresse: lm.adresse,
                    ville: lm.ville,
                    iduser: lm.iduser,
                }
                event.links = {
                    self: { href: `${SERVER} event / ${lm.id} ` },
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
                let previous = SERVER + "events?page=" + parseInt(parseInt(page) - 1) + "&size=" + size;
                data.previous = previous;
            }

            if (endIndex < count) {
                let next = SERVER + "users?page=" + parseInt(parseInt(page) + 1) + "&size=" + size;
                data.next = next;
            }
            data.events = eventList.slice(startIndex, endIndex);

            res.status(200).json(data);

        }


    })

});

app.get("/event/:token", (req, res) => {

    let tooken = req.params.token;

    $query = `SELECT * FROM public."event" WHERE token ='${tooken}'`;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {

            res.status(200).json(result.rows[0]);

        }


    })

});

app.get("/user/:id", function (req, res) {



    let id = req.params.id;

    $query = `SELECT * from public."user" WHERE id ='${id}' `;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {

            res.status(200).send(result.rows[0]);

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

            res.status(200).json(data);


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


    $query = `SELECT * from public."event"  ORDER BY id ASC `;

    client.query($query, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let eventList = [];
            let event = {};
            result.rows.forEach(lm => {
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

    $query2 = `SELECT id from public."event" WHERE token = '${token}' `;

    client.query($query2, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let idd = result.rows[0].id;
            console.log(result.rows[0].id);
            $query = `SELECT * from participe WHERE idevent = '${idd}' `;

            client.query($query, (err, result2) => {

                if (err) {
                    console.error(err);
                    res.status(404).send(err);
                } else {
                    console.log(result2);
                    res.status(200).send(result2.rows);

                }


            })
        }

    })
});


app.post("/participe", (req, res) => {
    let token = req.body.token;
    console.log("token " + token);
    let id;
    $query2 = `SELECT id from public."event" WHERE token = '${token}' `;

    client.query($query2, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            console.log(result.rows[0].id);
            id = result.rows[0].id;
            let event = req.body;

            let $query = `INSERT INTO  public."participe"(idevent, nom) VALUES('${id}', '${event.nom}')`;
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

    $query2 = `SELECT id from public."event" WHERE token = '${token}' `;

    client.query($query2, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            let idd = result.rows[0].id;
            console.log("IDDDDDDDDDD " + result.rows[0].id);
            $query = `SELECT * from public."commentaires" WHERE idevent = '${idd}' `;

            client.query($query, (err, result2) => {

                if (err) {
                    console.error(err);
                    res.status(404).send(err);
                } else {
                    console.log(result2);
                    res.status(200).send(result2.rows);

                }


            })
        }

    })
});

app.post("/comment", (req, res) => {
    let token = req.body.token;
    console.log("token " + token);
    let id;
    $query2 = `SELECT id from public."event" WHERE token = '${token}' `;

    client.query($query2, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            console.log(result.rows[0].id);
            id = result.rows[0].id;
            let event = req.body;
            let date2 = new Date();
            date2 = date2.getUTCFullYear() + '-' +
                ('00' + (date2.getUTCMonth() + 1)).slice(-2) + '-' +
                ('00' + date2.getUTCDate()).slice(-2) + ' ' +
                ('00' + date2.getUTCHours()).slice(-2) + ':' +
                ('00' + date2.getUTCMinutes()).slice(-2) + ':' +
                ('00' + date2.getUTCSeconds()).slice(-2);
            let $query = `INSERT INTO public."commentaires"(idevent, nom, commentaire,date) VALUES('${id}', '${event.nom}', '${event.commentaire}','${date2}')`;
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
    let query = `UPDATE public."event" SET titre = "${event.titre}", description= '${event.description}', date = "${date2}",etat = "${event.etat}", x= '${event.x}', y = "${event.y}" , adresse = "${event.adresse}"WHERE id= "${id}" `;

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
    $query2 = `SELECT id from public."event" WHERE token = '${token}' `;

    client.query($query2, (err, result) => {

        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            console.log(result.rows[0].id);
            id = result.rows[0].id;
            let event = req.body;

            let $query = `INSERT INTO public."commentaires"(idevent, nom, commentaire) VALUES('${id}', '${event.nom}', '${event.commentaire}')`;
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


app.listen(process.env.PORT, '0.0.0.0')
console.log(`API Running on http://${HOST}:${PORT}`)
