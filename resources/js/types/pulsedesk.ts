export type Project = {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    accent_color: string;
    custom_domain: string | null;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    boards_count?: number;
    posts_count?: number;
    boards?: Board[];
};

export type Board = {
    id: number;
    project_id: number;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    posts_count?: number;
};

export type Post = {
    id: number;
    board_id: number;
    author_name: string;
    author_email: string;
    user_id: number | null;
    title: string;
    body: string;
    status: string;
    vote_count: number;
    comment_count: number;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
    board?: Board;
    tags?: Tag[];
    comments?: Comment[];
    votes?: Vote[];
};

export type Vote = {
    id: number;
    post_id: number;
    voter_email: string;
    user_id: number | null;
    created_at: string;
};

export type Comment = {
    id: number;
    post_id: number;
    user_id: number | null;
    author_name: string;
    author_email: string;
    body: string;
    is_admin_reply: boolean;
    created_at: string;
};

export type Tag = {
    id: number;
    project_id: number;
    name: string;
    color: string;
};

export type ChangelogEntry = {
    id: number;
    project_id: number;
    title: string;
    body: string;
    type: string;
    published_at: string | null;
    is_published: boolean;
    created_at: string;
};

export type ProjectStats = {
    total_posts: number;
    total_votes: number;
    pending_posts: number;
    in_progress_posts: number;
    completed_posts: number;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};
