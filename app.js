const express = require('express');
const morgan = require('morgan');
const ejs = require('ejs');
const multer = require('multer');
const session = require('express-session');
const Nedb = require('nedb');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v1'); 
const fs = require('fs');

const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/upload')
    },
    filename: function (req, file, cb) {
        cb(null, uuid())
    }
});
const upload = multer({storage});

const db = {};
db.datas = new Nedb({filename: 'datasfile'});
db.datas.loadDatabase();
const bookModel = {type: 'book', value: {
    name: null, file: null, thumb: null, category: [], 
    user: null, share: [], tag: [], fav: false
}};
const ctgrModel = {type: 'category', value: {name: null, user: null}};
const userModel = {type: 'user', value: {name: null, salt: null, hash: null}};
const findDb = (query) => {
    return new Promise((resolve, reject) => {
        db.datas.find(query, (err, docs) => {
            if (err) reject(err);
            else  resolve(docs);
        });
    });
};

const saltRounds = 10;

app.set('trust proxy', 1);
app.set('ejs', ejs.renderFile);
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(session({
    secret: 'my_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

app.get('/', (req, res) => {
    res.render('index.ejs', {});
});

app.post('/create_account', upload.none(), async (req, res) => {
    const name = req.body.name;
    const pass = req.body.password;
    const query = {'value.name': name};
    try {
        const resp = await findDb(query);
        if (resp.length >= 1) {
            res.status(400).send('ng');
        } else {
            const salt = await bcrypt.genSalt(saltRounds)
            const hash = await bcrypt.hash(pass, salt);
            const newDoc = Object.assign({}, userModel, {value: {name, salt, hash}});
            db.datas.insert(newDoc, (err) => {
                if (err) res.status(500).send(err);
                else res.send('ok');
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/login', upload.none(), (req, res) => {
    const name = req.body.name;
    const pass = req.body.password;
    console.log(name, pass);
    const query = {'value.name': name};
    db.datas.find(query, async (err, doc) => {
        if (err) res.status(500).send(err);
        else if (doc.length === 0) {
            res.status(400).send('ng');
        } else {
            const result = await bcrypt.compare(pass, doc[0].value.hash);
            if (result) {
                req.session.name = name;
                res.send('ok');
            } else {
                res.send('ng');
            }
        }
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('ok');
});

app.get('/login_state', (req, res) => {
    console.log(req.session.name);
    res.send(req.session.name);
});

app.post('/upload_book', upload.fields([
    {name: 'pdf'}, {name: 'thumb'}
]), (req, res) => {
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send('ng');
    } else {
        const doc = Object.assign({}, bookModel, {
            value: Object.assign({}, bookModel.value, {
                name: req.files.pdf[0].originalname,
                file: req.files.pdf[0].filename, 
                thumb: req.files.thumb[0].filename,
                user: req.session.name
            })
        });
        console.log(doc);
        db.datas.insert(doc, (err, resp) => {
            if (err) res.status(500).send(err);
            else res.send('ok');
        });
    }
    
});

app.post('/create_ctgr', upload.none(), (req, res) => {
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send('ng');
    } else {
        const doc = Object.assign({}, ctgrModel, {
            value: {
                name: req.body.category,
                user: req.session.name
            }
        });
        db.datas.insert(doc, (err, resp) => {
            if (err) res.status(500).send(err);
            else res.send('ok');
        });
    }
});

app.post('/update_book_ctgr', upload.none(), async (req, res) => {
    console.log(req.body);
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send('ng');
    } else {
        const query = {_id: req.body.tgtId};
        try {
            const resp = await findDb(query);
            const doc = resp[0];
            const update = {$set: {value: {
                ...doc.value, category: JSON.parse(req.body.category)
            }}};
            db.datas.update(query, update, {}, (err) => {
                if (err) res.status(500).send(err);
                else res.send('ok');
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }
});

app.post('/update_book_share', upload.none(), async (req, res) => {
    console.log(req.body);
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send('ng');
    } else {
        const query = {_id: req.body.tgtId};
        try {
            const resp = await findDb(query);
            const doc = resp[0];
            const update = {$set: {value: {
                ...doc.value, share: JSON.parse(req.body.share)
            }}};
            db.datas.update(query, update, {}, (err) => {
                if (err) res.status(500).send(err);
                else res.send('ok');
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }
});

app.post('/update_book_tag', upload.none(), async (req, res) => {
    console.log(req.body);
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send('ng');
    } else {
        const query = {_id: req.body.tgtId};
        try {
            const resp = await findDb(query);
            const doc = resp[0];
            const update = {$set: {value: {
                ...doc.value, tag: JSON.parse(req.body.tag)
            }}};
            db.datas.update(query, update, {}, (err) => {
                if (err) res.status(500).send(err);
                else res.send('ok');
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }
});

app.post('/update_book_fav', upload.none(), async (req, res) => {
    console.log(req.body);
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send('ng');
    } else {
        const query = {_id: req.body.tgtId};
        try {
            const resp = await findDb(query);
            const doc = resp[0];
            const update = {$set: {value: {
                ...doc.value, fav: req.body.fav
            }}};
            db.datas.update(query, update, {}, (err) => {
                if (err) res.status(500).send(err);
                else res.send('ok');
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }
});

app.post('/delete_book', upload.none(), (req, res) => {
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send('ng');
    } else {
        const query = {_id: req.body.tgtId};
        db.datas.remove(query, {}, (err, rm) => {
            if (err) res.status(500).send(err);
            else res.send('ok');
        });
    }
});

app.post('/delete_category', upload.none(), (req, res) => {
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send('ng');
    } else {
        const query = {_id: req.body.tgtId};
        db.datas.remove(query, {}, (err, rm) => {
            if (err) res.status(500).send(err);
            else res.send('ok');
        });
    }
});

app.get('/books', upload.none(), (req, res) => {
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send({result: 'ng'});
    } else {
        const query = {type: 'book', 'value.user': req.session.name};
        db.datas.find(query, (err, docs) => {
            if (err) res.status(500).send(err);
            else res.send({result: docs});
        });
    }
});

app.get('/books_share', upload.none(), async (req, res) => {
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send({result: 'ng'});
    } else {
        try {
            const query = {type: 'book', 'value.share': {$in: [req.session.name]}};
            const resp = await findDb(query);
            res.send({result: resp});
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
});

app.get('/categories', upload.none(), (req, res) => {
    if (req.session.name === void 0 || req.session.name === null) {
        res.status(400).send({result: 'ng'});
    } else {
        const query = {type: 'category', 'value.user': req.session.name};
        db.datas.find(query, (err, docs) => {
            if (err) res.status(500).send(err);
            else res.send({result: docs});
        });
    }

});

app.get('/thumbnail', (req, res) => {
    db.datas.find({_id: req.query.tgtId}, (err, docs) => {
        if (err) res.status(500).send(err);
        else {
            const filename = docs[0].value.thumb;
            const filepath = __dirname + '/upload/' + filename;
            const thumb = fs.readFileSync(filepath);
            res.send(thumb);
        }
    });
});

app.get('/pdf', (req, res) => {
    db.datas.find({_id: req.query.tgtId}, (err, docs) => {
        if (err) res.status(500).send(err);
        else {
            const filename = docs[0].value.file;
            const filepath = __dirname + '/upload/' + filename;
            const pdf = fs.readFileSync(filepath);
            res.send(pdf);
        }
    });
});

app.listen(3000, () => console.log('server start on 3000'));