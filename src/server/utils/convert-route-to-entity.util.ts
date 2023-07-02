const mapping: Record<string, string> = {
  feedbacks: 'feedback',
  lessons: 'lesson',
  matches: 'match',
  providers: 'provider',
  puzzles: 'puzzle',
  'strategy-guides': 'strategy_guide',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
