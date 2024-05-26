const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllMovies = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const result = await db.collection("movies").find().toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while fetching movies",
        details: err.message,
      });
  }
};

const getMovieById = async (req, res) => {
  const id = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection("movies")
    .findOne({ _id: id });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "Movie not found" });
  }
};

const createMovie = async (req, res) => {
  const movie = {
    title: req.body.title,
    release_year: req.body.release_year,
    genre: req.body.genre,
    director: req.body.director,
    rating: req.body.rating,
  };

  const result = await mongodb
    .getDb()
    .db()
    .collection("movies")
    .insertOne(movie);
  if (result) {
    res.status(201).json(result);
  } else {
    res.status(500).json({ message: "Error creating movie" });
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
        .json(
          response.error || "Some error occurred while updating the movie."
        );
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Database update failed", details: error.message });
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
        .json(
          response.error || "Some error occurred while deleting the movie."
        );
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Database deletion failed", details: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
