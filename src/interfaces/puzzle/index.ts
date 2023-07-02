import { ProviderInterface } from 'interfaces/provider';
import { GetQueryInterface } from 'interfaces';

export interface PuzzleInterface {
  id?: string;
  description: string;
  solution: string;
  hint?: string;
  provider_id?: string;
  created_at?: any;
  updated_at?: any;

  provider?: ProviderInterface;
  _count?: {};
}

export interface PuzzleGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  solution?: string;
  hint?: string;
  provider_id?: string;
}
