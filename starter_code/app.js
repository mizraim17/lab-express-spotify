
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");

// configuramos la ruta a las views
app.set("views", __dirname + "/views");
// configuramos el motor de templates
app.set("view engine", "hbs");
// configuramos la ruta a los estaticos
app.use(express.static(path.join(__dirname, "public")));

// registramos partials
hbs.registerPartials(`${__dirname}/views/partials`);



app.use(logger(`dev`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '43df7be734074025933ae3cd4afa1197',
  clientSecret = '97faaacfca5943ae91ba8acfe3c9364c';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (req, res) => {
  res.render('index');
});

app.get("/artists", (req, res) => {
  let search = req.query.artists;
  console.log('search',req.query)

  spotifyApi.searchArtists(search)
    .then(data => {
      let artists = data.body.artists.items;
      // res.json(artists)
      res.render("artists", {artists});
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/albums/:id', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
      let albums = data.body.items;
       // res.json(albums);
      res.render("albums", {albums});
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/tracks/:id', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id)
    .then(data => {
      let tracks = data.body.items;
        // res.json(tracks);
      res.render("tracks", {tracks});
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log("Running on :3000");
});