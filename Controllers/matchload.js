const handleMatchLoad = (req, res, db) => {
  const { hteam, ateam, team1, team2, hscore, ascore, winner, database } =
    req.body;
  if (!hteam || !ateam || !team1 || !team2 || !winner)
    return res.status(400).json("Missing data");
  db(database)
    .insert({
      hteam: hteam.toLowerCase(),
      ateam: ateam.toLowerCase(),
      team1: team1.toLowerCase(),
      team2: team2.toLowerCase(),
      hscore: hscore,
      ascore: ascore,
      winner: winner.toLowerCase(),
      playedon: new Date(),
    })
    .returning("*")
    .then((match) => res.json(match[0]))
    .catch((err) => res.status(400).json("Couldn't save match"));
};

module.exports = {
  handleMatchLoad,
};
