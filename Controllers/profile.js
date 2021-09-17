const handleProfileGet = (req, res, db) => {
   const { id } = req.params;
   db.select('*').from('matches').where('hteam', '=', id).orWhere('ateam', '=', id)
      .then(matches => matches.sort((a, b) => (a.playedOn < b.playedOn) ? 1 : -1).slice(0,5))
      .then(matches => res.json(matches))
}

module.exports = {
   handleProfileGet
}