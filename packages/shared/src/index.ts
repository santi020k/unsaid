export type Locale = 'en' | 'es'

export interface Post {
  id: string
  content: string
  locale: Locale
  created_at: string
}

export interface CreatePostBody {
  content: string
  locale: Locale
  captchaToken: string
}

export interface ApiResponse<T> {
  data: T
  error?: never
}

export interface ApiError {
  error: string
  data?: never
}

export type ApiResult<T> = ApiResponse<T> | ApiError

export interface PostsResponse {
  posts: Post[]
  total: number
}

export const POST_MAX_LENGTH = 280
export const POST_MIN_LENGTH = 10
export const DAILY_LIMIT = 3
