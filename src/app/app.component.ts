import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post, PostService } from './services/post.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // 1. Modern State Management using Signals
  posts = signal<Post[]>([]);
  isLoading = signal<boolean>(false);
  showForm = signal<boolean>(false);
  errorMessage = signal<string>('');
  title = signal('Angular-Intern-Assignment');

  postForm: FormGroup;
  
  // 2. Using inject() for cleaner Dependency Injection
  private postService = inject(PostService);
  private fb = inject(FormBuilder);

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.fetchPosts();
  }

  // 3. Proper Loader State Management
  fetchPosts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load posts. Please check your connection.');
        this.isLoading.set(false);
      }
    });
  }

  toggleForm(): void {
    this.showForm.update(val => !val);
    this.errorMessage.set('');
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.isLoading.set(true);
      const newEntry: Post = this.postForm.value;

      this.postService.createPost(newEntry).subscribe({
        next: (response) => {
          // Logic: Calculate manual ID based on current signal value
          const currentPosts = this.posts();
          const maxId = currentPosts.length > 0 
            ? Math.max(...currentPosts.map(p => p.id || 0)) 
            : 0;
          
          response.id = maxId + 1;

          // Update state by prepending new post to the array
          this.posts.set([response, ...currentPosts]);
          
          // Reset UI state
          this.postForm.reset();
          this.showForm.set(false);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error: Could not save the post to the server.');
          this.isLoading.set(false);
        }
      });
    }
  }
}