import axios from 'axios';
import queryString from 'query-string';
import { PuzzleInterface, PuzzleGetQueryInterface } from 'interfaces/puzzle';
import { GetQueryInterface } from '../../interfaces';

export const getPuzzles = async (query?: PuzzleGetQueryInterface) => {
  const response = await axios.get(`/api/puzzles${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPuzzle = async (puzzle: PuzzleInterface) => {
  const response = await axios.post('/api/puzzles', puzzle);
  return response.data;
};

export const updatePuzzleById = async (id: string, puzzle: PuzzleInterface) => {
  const response = await axios.put(`/api/puzzles/${id}`, puzzle);
  return response.data;
};

export const getPuzzleById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/puzzles/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePuzzleById = async (id: string) => {
  const response = await axios.delete(`/api/puzzles/${id}`);
  return response.data;
};
