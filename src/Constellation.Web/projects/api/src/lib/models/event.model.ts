export interface EventDto {
  id: number;
  title: string;
  description: string;
  url: string;
  location: string;
  startDate: string | null;
  endDate: string | null;
  source: string;
  tags: string[];
  relevanceScore: number;
}
