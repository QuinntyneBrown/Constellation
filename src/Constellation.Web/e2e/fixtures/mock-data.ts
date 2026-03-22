export const mockEvents = [
  {
    id: 1,
    title: 'BEYA STEM Conference 2026',
    description:
      'Annual conference celebrating Black excellence in STEM fields, featuring keynotes from aerospace and defence industry leaders.',
    url: 'https://example.com/beya-2026',
    location: 'Metro Toronto Convention Centre',
    startDate: '2026-03-28T09:00:00',
    endDate: '2026-03-30T17:00:00',
    source: 'Eventbrite',
    tags: ['STEM', 'Aerospace', 'Defence', 'Networking', 'Conference'],
    relevanceScore: 9.2,
  },
  {
    id: 2,
    title: 'NSBE Toronto Chapter Meetup',
    description:
      'Monthly networking event for Black engineers in the Greater Toronto Area. Panel discussion on careers in defence technology.',
    url: 'https://example.com/nsbe-meetup',
    location: 'Mississauga Civic Centre',
    startDate: '2026-04-05T18:00:00',
    endDate: '2026-04-05T21:00:00',
    source: 'Meetup',
    tags: ['Engineering', 'Networking', 'Defence'],
    relevanceScore: 8.7,
  },
  {
    id: 3,
    title: 'Black in Aerospace Networking Night',
    description:
      'Connect with Black professionals working in the Canadian aerospace sector.',
    url: 'https://example.com/bia-night',
    location: 'Toronto Downtown',
    startDate: '2026-04-12T18:30:00',
    endDate: '2026-04-12T21:00:00',
    source: 'WebSearch',
    tags: ['Aerospace', 'Networking'],
    relevanceScore: 7.5,
  },
  {
    id: 4,
    title: 'Defence Industry Diversity Summit',
    description:
      'Summit focused on increasing diversity in Canada\'s defence industry workforce.',
    url: 'https://example.com/diversity-summit',
    location: 'Ottawa Convention Centre',
    startDate: '2026-04-20T09:00:00',
    endDate: '2026-04-20T17:00:00',
    source: 'Eventbrite',
    tags: ['Defence', 'Diversity', 'Conference'],
    relevanceScore: 8.9,
  },
  {
    id: 5,
    title: 'Black Engineers of Canada — GTA Chapter',
    description:
      'Quarterly meetup for Black engineers in the Greater Toronto Area.',
    url: 'https://example.com/bec-gta',
    location: 'Toronto',
    startDate: '2026-04-22T18:00:00',
    endDate: '2026-04-22T20:00:00',
    source: 'Meetup',
    tags: ['Engineering', 'Networking'],
    relevanceScore: 7.3,
  },
];

export const mockPagedEvents = {
  items: mockEvents,
  totalCount: 1284,
  page: 1,
  pageSize: 20,
  totalPages: 65,
};

export const mockSources = [
  { source: 'Eventbrite', eventCount: 842 },
  { source: 'Meetup', eventCount: 298 },
  { source: 'WebSearch', eventCount: 144 },
];

export const mockEventDetail = mockEvents[0];
