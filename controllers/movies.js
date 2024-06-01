const { body, validationResult } = require('express-validator');

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
  try {
  const id = new ObjectId(req.params.id);
  const db = mongodb.getDb();
  const result = await db.collection("movies")
    .findOne({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while fetching movie",
        details: err.message,
      });
  }
};

const createMovie = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const movie = {
    title: req.body.title,
    release_year: req.body.release_year,
    genre: req.body.genre,
    director: req.body.director,
    rating: req.body.rating,
  };

  try {
    const db = mongodb.getDb();
    const result = await db.collection("movies").insertOne(movie);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: "Error creating movie" });
  }
};

router.post('/', [
  body('title').isLength({ min: 1 }).withMessage('Title is required'),
  body('release_year').isNumeric().withMessage('Release year must be a number'),
  body('genre').isLength({ min: 1 }).withMessage('Genre is required'),
  body('director').isLength({ min: 1 }).withMessage('Director is required'),
  body('rating').isNumeric().withMessage('Rating must be a number'),
], createMovie);

const updateMovie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = new ObjectId(req.params.id);
    const movie = {
      title: req.body.title,
      release_year: req.body.release_year,
      genre: req.body.genre,
      director: req.body.director,
      rating: req.body.rating,
    };

    const db = mongodb.getDb();
    const response = await db.collection("movies").replaceOne({ _id: id }, movie);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || "Some error occurred while updating the movie.");
    }
  } catch (error) {
    res.status(500).json({ error: "Database update failed", details: error.message });
  }
};

router.put('/:id', [
  body('title').isLength({ min: 1 }).withMessage('Title is required'),
  body('release_year').isNumeric().withMessage('Release year must be a number'),
  body('genre').isLength({ min: 1 }).withMessage('Genre is required'),
  body('director').isLength({ min: 1 }).withMessage('Director is required'),
  body('rating').isNumeric().withMessage('Rating must be a number'),
], updateMovie);

const deleteMovie = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const db = mongodb.getDb();
    const response = await db.collection("movies")
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
