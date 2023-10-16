type Span = {
  start: number;
  end: number;
  type: string;
};

type Content = {
  type: string;
  text: string;
  spans: Span[];
};

export interface PostsResult {
  uid?: string;
  data?: {
    title?: Content[];
    content?: Content[];
  };
  last_publication_date?: string;
}
