import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() { }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

 // pojo post interface
export interface Post {
  userId: number;
  id?: number;
  title?: string;
  body?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) { }

  // 1. Fetching posts Method(GET)
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // 2. Creating the post method (POST)
  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }
}