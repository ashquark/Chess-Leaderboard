<<<<<<< HEAD
const express = require("express");
const axios = require("axios");
const redis = require("redis");
const bodyParser = require("body-parser");
const path = require("path");

const PORT = process.env.PORT || 8080;

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.static('public'));

let url = 'https://api.chess.com/pub/leaderboards';
let redisClient;

(() => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.error(`Error: ${error}`));
  redisClient.connect();
  redisClient.on("connect", () => {
    console.log("Connected to Redis");
  });
})();


async function fetchDataFromAPI() {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

async function storeData(dataMode) {
  try {
    const cacheResults = await redisClient.get(dataMode);
    if(cacheResults) {
      console.log(true);
      console.log("cache hit!");
      const cacheData=JSON.parse(cacheResults);
      return cacheData;
    }else if(!cacheResults){
        const data = await fetchDataFromAPI();
        const dataObject = {
        daily: data['daily'],
        blitz: data['live_blitz'],
        bullet: data['live_bullet'],
        rapid: data['live_rapid']
        };

        const rankings = ['daily', 'blitz', 'bullet', 'rapid'];

        for (const ranking of rankings) {
        dataObject[ranking] = dataObject[ranking].map(({ rank, avatar, url, username, name, title, score }) => {
            return { rank, avatar, url, username, name, title, score };
        });
        }

        const obj = dataObject[dataMode];
        const redisObj = JSON.stringify(obj);
        if(redisObj){
          console.log(false);
          console.log("cache miss!\nData is going to be stored in cache!");
          await redisClient.set(dataMode,redisObj);
        }
        return obj;
    }
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/leaderboard/:mode', (req, res) => {
  const mode = req.params.mode;
  storeData(mode)
    .then(leaderboardData => {
      console.log(typeof(leaderboardData));
      res.render("leaderboard", { title: mode.charAt(0).toUpperCase() + mode.slice(1), data: leaderboardData});
    })
    .catch(error => {
      console.error('Error fetching and storing data:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is successfully running on port: " + PORT);
  } else {
    console.log("Error Occurred (SERVER CANT START): ", error);
  }
});
=======
const express = require("express");
const axios = require("axios");
const redis = require("redis");
const bodyParser = require("body-parser");
const path = require("path");

const PORT = process.env.PORT || 8080;

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.static('public'));

let url = 'https://api.chess.com/pub/leaderboards';
let redisClient;

(() => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.error(`Error: ${error}`));
  redisClient.connect();
  redisClient.on("connect", () => {
    console.log("Connected to Redis");
  });
})();


async function fetchDataFromAPI() {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

async function storeData(dataMode) {
  try {
    const cacheResults = await redisClient.get(dataMode);
    if(cacheResults) {
      console.log(true);
      console.log("cache hit!");
      const cacheData=JSON.parse(cacheResults);
      return cacheData;
    }else if(!cacheResults){
        const data = await fetchDataFromAPI();
        const dataObject = {
        daily: data['daily'],
        blitz: data['live_blitz'],
        bullet: data['live_bullet'],
        rapid: data['live_rapid']
        };

        const rankings = ['daily', 'blitz', 'bullet', 'rapid'];

        for (const ranking of rankings) {
        dataObject[ranking] = dataObject[ranking].map(({ rank, avatar, url, username, name, title, score }) => {
            return { rank, avatar, url, username, name, title, score };
        });
        }

        const obj = dataObject[dataMode];
        const redisObj = JSON.stringify(obj);
        if(redisObj){
          console.log(false);
          console.log("cache miss!\nData is going to be stored in cache!");
          await redisClient.set(dataMode,redisObj);
        }
        return obj;
    }
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/leaderboard/:mode', (req, res) => {
  const mode = req.params.mode;
  storeData(mode)
    .then(leaderboardData => {
      console.log(typeof(leaderboardData));
      res.render("leaderboard", { title: mode.charAt(0).toUpperCase() + mode.slice(1), data: leaderboardData});
    })
    .catch(error => {
      console.error('Error fetching and storing data:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is successfully running on port: " + PORT);
  } else {
    console.log("Error Occurred (SERVER CANT START): ", error);
  }
});
>>>>>>> 18d2a02d67e066053422caa249724cdddfd8154f
