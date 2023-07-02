import { ProviderInterface } from 'interfaces/provider';
import { GetQueryInterface } from 'interfaces';

export interface StrategyGuideInterface {
  id?: string;
  title: string;
  content: string;
  provider_id?: string;
  created_at?: any;
  updated_at?: any;

  provider?: ProviderInterface;
  _count?: {};
}

export interface StrategyGuideGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  content?: string;
  provider_id?: string;
}
