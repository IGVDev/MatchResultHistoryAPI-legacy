const { json } = require("body-parser");
const _ = require("underscore");

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const handleStandingsGet = (req, res, db) => {
  const { database } = req.body;
  db.select("hteam", "ateam")
    .from(database)
    .then((data) => {
      let arr = [];
      for (match of data) {
        if (!arr.includes(match.hteam)) {
          arr.push(match.hteam);
        }
        if (!arr.includes(match.ateam)) {
          arr.push(match.ateam);
        }
      }
      return arr;
    })
    .then((data) => {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          name: capitalize(data[i]),
          gamesPlayed: 0,
          points: 0,
          gamesWon: 0,
          gamesTied: 0,
          gamesLost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDif: 0,
          winpercent: 0,
        });
      }
      return arr;
    })
    // .then((data) => res.json(data))
    .then((users) => {
      db(database)
        .then((matches) => {
          for (match of matches) {
            let { hteam, ateam, hscore, ascore } = match;
            let home = _.find(users, { name: capitalize(hteam) });
            let away = _.find(users, { name: capitalize(ateam) });
            if (away === undefined) console.log(match);
            if (hscore > ascore) {
              (home.points += 3),
                home.gamesPlayed++,
                home.gamesWon++,
                (home.goalsFor += hscore),
                (home.goalsAgainst += ascore),
                (home.goalDif = home.goalsFor - home.goalsAgainst),
                (home.winpercent = (
                  (home.gamesWon / home.gamesPlayed) *
                  100
                ).toFixed(2)),
                away.gamesPlayed++,
                away.gamesLost++,
                (away.goalsFor += ascore),
                (away.goalsAgainst += hscore),
                (away.goalDif = away.goalsFor - away.goalsAgainst),
                (away.winpercent = (
                  (away.gamesWon / away.gamesPlayed) *
                  100
                ).toFixed(2));
            } else if (hscore == ascore) {
              (home.points += 1),
                home.gamesPlayed++,
                home.gamesTied++,
                (home.goalsFor += hscore),
                (home.goalsAgainst += ascore),
                (home.goalDif = home.goalsFor - home.goalsAgainst),
                (home.winpercent = (
                  (home.gamesWon / home.gamesPlayed) *
                  100
                ).toFixed(2)),
                away.gamesPlayed++,
                (away.points += 1),
                away.gamesTied++,
                (away.goalsFor += ascore),
                (away.goalsAgainst += hscore),
                (away.goalDif = away.goalsFor - away.goalsAgainst),
                (away.winpercent = (
                  (away.gamesWon / away.gamesPlayed) *
                  100
                ).toFixed(2));
            } else {
              home.gamesPlayed++,
                home.gamesLost++,
                (home.goalsFor += hscore),
                (home.goalsAgainst += ascore),
                (home.goalDif = home.goalsFor - home.goalsAgainst),
                (home.winpercent = (
                  (home.gamesWon / home.gamesPlayed) *
                  100
                ).toFixed(2)),
                away.gamesPlayed++,
                (away.points += 3),
                away.gamesWon++,
                (away.goalsFor += ascore),
                (away.goalsAgainst += hscore),
                (away.goalDif = away.goalsFor - away.goalsAgainst),
                (away.winpercent = (
                  (away.gamesWon / away.gamesPlayed) *
                  100
                ).toFixed(2));
            }
          }
          return users.sort((a, b) => (a.points < b.points ? 1 : -1));
        })
        .then((users) => res.json(users));
    })
    .catch((err) => res.status(400).json(err));
};

module.exports = {
  handleStandingsGet,
};
