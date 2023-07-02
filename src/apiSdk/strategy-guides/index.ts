import axios from 'axios';
import queryString from 'query-string';
import { StrategyGuideInterface, StrategyGuideGetQueryInterface } from 'interfaces/strategy-guide';
import { GetQueryInterface } from '../../interfaces';

export const getStrategyGuides = async (query?: StrategyGuideGetQueryInterface) => {
  const response = await axios.get(`/api/strategy-guides${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createStrategyGuide = async (strategyGuide: StrategyGuideInterface) => {
  const response = await axios.post('/api/strategy-guides', strategyGuide);
  return response.data;
};

export const updateStrategyGuideById = async (id: string, strategyGuide: StrategyGuideInterface) => {
  const response = await axios.put(`/api/strategy-guides/${id}`, strategyGuide);
  return response.data;
};

export const getStrategyGuideById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/strategy-guides/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteStrategyGuideById = async (id: string) => {
  const response = await axios.delete(`/api/strategy-guides/${id}`);
  return response.data;
};
