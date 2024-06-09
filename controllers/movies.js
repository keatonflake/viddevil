const { body, validationResult } = require('express-validator');
const express = require("express");
const router = express.Router();

const mongodb = require("../config/db");
const ObjectId = require("mongodb").ObjectId;

const Joi = require('joi');

const movieSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
  }),
  release_year: Joi.number().required().messages({
    'any.required': 'Release year is required',
    'number.base': 'Release year must be a number',
  }),
  genre: Joi.string().required().messages({
    'any.required': 'Genre is required',
  }),
  director: Joi.string().required().messages({
    'any.required': 'Director is required',
  }),
  rating: Joi.number().required().messages({
    'any.required': 'Rating is required',
    'number.base': 'Rating must be a number',
  }),
});

const getAllMovies = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const movies = await db.collection("movies").find().toArray();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Database query failed", details: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const db = mongodb.getDb();
    const movie = await db.collection("movies").findOne({ _id: id });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Database query failed", details: error.message });
  }
};

const createMovie = async (req, res) => {
  const { error } = movieSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const movie = {
      title: req.body.title,
      release_year: req.body.release_year,
      genre: req.body.genre,
      director: req.body.director,
      rating: req.body.rating,
    };

    const db = mongodb.getDb();
    const response = await db.collection("movies").insertOne(movie);

    return res.status(201).json({ _id: response.insertedId, ...movie });
  } catch (error) {
    return res.status(500).json({ error: "Database insertion failed", details: error.message });
  }
};

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
    const response = await db.collection("movies").updateOne({ _id: id }, { $set: movie });

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || "Some error occurred while updating the movie.");
    }
  } catch (error) {
    res.status(500).json({ error: "Database update failed", details: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const db = mongodb.getDb();
    const response = await db.collection("movies").deleteOne({ _id: id });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || "Some error occurred while deleting the movie.");
    }
  } catch (error) {
    res.status(500).json({ error: "Database deletion failed", details: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};