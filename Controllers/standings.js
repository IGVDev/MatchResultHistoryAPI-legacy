const _ = require('underscore');

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const handleStandingsGet = (req, res, db) => {
   db.select('name').from('users')
      .then(data => {
         for (user of data) {
            user.name = capitalize(user.name),
            user.gamesPlayed = 0,
            user.points = 0,
            user.gamesWon = 0,
            user.gamesTied = 0,
            user.gamesLost = 0,
            user.goalsFor = 0,
            user.goalsAgainst = 0,
            user.goalDif = 0,
            user.winpercent = 0
         }
         return data;
      })
      .then(users => {
         db('matches')
         .then(matches => {
            for (match of matches) {
               let { hteam, ateam, hscore, ascore } = match;
               let home = _.find(users, {name: capitalize(hteam)});
               let away = _.find(users, {name: capitalize(ateam)});
               if (hscore > ascore) {
                  home.points += 3,
                  home.gamesPlayed ++,
                  home.gamesWon ++,
                  home.goalsFor += hscore,
                  home.goalsAgainst += ascore,
                  home.goalDif = (home.goalsFor - home.goalsAgainst),
                  home.winpercent = ((home.gamesWon / home.gamesPlayed)*100).toFixed(2),
                  away.gamesPlayed ++,
                  away.gamesLost ++,
                  away.goalsFor += ascore,
                  away.goalsAgainst += hscore,
                  away.goalDif = (away.goalsFor - away.goalsAgainst),
                  away.winpercent = ((away.gamesWon / away.gamesPlayed)*100).toFixed(2)
               }
               else if (hscore == ascore) {
                  home.points += 1,
                  home.gamesPlayed ++,
                  home.gamesTied ++,
                  home.goalsFor += hscore,
                  home.goalsAgainst += ascore,
                  home.goalDif = (home.goalsFor - home.goalsAgainst),
                  home.winpercent = ((home.gamesWon / home.gamesPlayed)*100).toFixed(2),
                  away.gamesPlayed ++,
                  away.points += 1,
                  away.gamesTied ++,
                  away.goalsFor += ascore,
                  away.goalsAgainst += hscore,
                  away.goalDif = (away.goalsFor - away.goalsAgainst),
                  away.winpercent = ((away.gamesWon / away.gamesPlayed)*100).toFixed(2)
               }
               else {
                  home.gamesPlayed ++,
                  home.gamesLost ++,
                  home.goalsFor += hscore,
                  home.goalsAgainst += ascore,
                  home.goalDif = (home.goalsFor - home.goalsAgainst),
                  home.winpercent = ((home.gamesWon / home.gamesPlayed)*100).toFixed(2),
                  away.gamesPlayed ++,
                  away.points += 3,
                  away.gamesWon ++,
                  away.goalsFor += ascore,
                  away.goalsAgainst += hscore,
                  away.goalDif = (away.goalsFor - away.goalsAgainst),
                  away.winpercent = ((away.gamesWon / away.gamesPlayed)*100).toFixed(2)
               }
            }
            return users.sort((a, b) => (a.points < b.points) ? 1 : -1);
         })
         .then(users => res.json(users))
      })
      .catch(err => res.status(200).json('couldn\'t get standings'));
}

module.exports = {
   handleStandingsGet
}