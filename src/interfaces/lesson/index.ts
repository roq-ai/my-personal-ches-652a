import { ProviderInterface } from 'interfaces/provider';
import { GetQueryInterface } from 'interfaces';

export interface LessonInterface {
  id?: string;
  title: string;
  content: string;
  skill_level: string;
  provider_id?: string;
  created_at?: any;
  updated_at?: any;

  provider?: ProviderInterface;
  _count?: {};
}

export interface LessonGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  content?: string;
  skill_level?: string;
  provider_id?: string;
}
