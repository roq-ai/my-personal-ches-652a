import { UserInterface } from 'interfaces/user';
import { ProviderInterface } from 'interfaces/provider';
import { GetQueryInterface } from 'interfaces';

export interface MatchInterface {
  id?: string;
  player_one_id?: string;
  player_two_id?: string;
  result: string;
  provider_id?: string;
  created_at?: any;
  updated_at?: any;

  user_match_player_one_idTouser?: UserInterface;
  user_match_player_two_idTouser?: UserInterface;
  provider?: ProviderInterface;
  _count?: {};
}

export interface MatchGetQueryInterface extends GetQueryInterface {
  id?: string;
  player_one_id?: string;
  player_two_id?: string;
  result?: string;
  provider_id?: string;
}
