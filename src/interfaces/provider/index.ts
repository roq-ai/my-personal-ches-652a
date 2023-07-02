import { FeedbackInterface } from 'interfaces/feedback';
import { LessonInterface } from 'interfaces/lesson';
import { MatchInterface } from 'interfaces/match';
import { PuzzleInterface } from 'interfaces/puzzle';
import { StrategyGuideInterface } from 'interfaces/strategy-guide';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ProviderInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  feedback?: FeedbackInterface[];
  lesson?: LessonInterface[];
  match?: MatchInterface[];
  puzzle?: PuzzleInterface[];
  strategy_guide?: StrategyGuideInterface[];
  user?: UserInterface;
  _count?: {
    feedback?: number;
    lesson?: number;
    match?: number;
    puzzle?: number;
    strategy_guide?: number;
  };
}

export interface ProviderGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
