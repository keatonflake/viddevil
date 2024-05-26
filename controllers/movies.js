const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

// const getAllMovies = async (req, res) => {
//   const result = await mongodb.getDb().db().collection('contact').find();
//   result.toArray().then((lists) => {
//       res.setHeader('Content-Type', 'application/json');
//       res.status(200).json(lists);
//   });
// };
const getAllMovies = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const result = await db.collection('movies').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching movies', details: err.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("movies")
      .findOne({ _id: id });
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  } catch (error) {
    res
      .status(404)
      .json({
        message: "The movie with the specified ID does not exist.",
        error,
      });
  }
};

const createMovie = async (req, res) => {
    try {
      const movie = {
        title: req.body.title,
        release_year: req.body.release_year,
        genre: req.body.genre,
        director: req.body.director,
        rating: req.body.rating,
      };
      
      const response = await mongodb
        .getDb()
        .db()
        .collection("movies")
        .insertOne(movie);
  
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res
          .status(500)
          .json(response.error || "Some error occurred while creating the movie.");
      }
    } catch (error) {
      res.status(500).json({ error: 'Database insertion failed', details: error.message });
    }
  };

  const updateMovie = async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const movie = {
        title: req.body.title,
        release_year: req.body.release_year,
        genre: req.body.genre,
        director: req.body.director,
        rating: req.body.rating,
      };
  
      const response = await mongodb
        .getDb()
        .db()
        .collection("movies")
        .replaceOne({ _id: id }, movie);
  
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res
          .status(500)
          .json(response.error || "Some error occurred while updating the movie.");
      }
    } catch (error) {
      res.status(500).json({ error: 'Database update failed', details: error.message });
    }
  };
  
  const deleteMovie = async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const response = await mongodb
        .getDb()
        .db()
        .collection("movies")
        .deleteOne({ _id: id }, true);
  
      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        res
          .status(500)
          .json(response.error || "Some error occurred while deleting the movie.");
      }
    } catch (error) {
      res.status(500).json({ error: 'Database deletion failed', details: error.message });
    }
  };
  
  module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
  };
  