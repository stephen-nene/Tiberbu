Here's how you can define views in Django using different approaches (Function-Based Views, Class-Based Views, and ViewSets) while keeping the code modular. The models will include relationships (`OneToOneField`, `ForeignKey`, and `ManyToManyField`) to demonstrate `select_related` and `prefetch_related`.  

---

### **Step 1: Define Models with Relationships**
```python
from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()

class Category(models.Model):
    name = models.CharField(max_length=50)

class Book(models.Model):
    title = models.CharField(max_length=150)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    categories = models.ManyToManyField(Category, related_name='books')
    published_date = models.DateField()

class BookDetail(models.Model):
    book = models.OneToOneField(Book, on_delete=models.CASCADE, related_name='detail')
    summary = models.TextField()
    pages = models.IntegerField()
```

---

## **Step 2: Creating Views (Modularized)**
### **A. Function-Based Views (FBVs)**
```python
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Book

def book_list(request):
    books = Book.objects.select_related('author').prefetch_related('categories').all()
    data = [{"title": book.title, "author": book.author.name, "categories": [cat.name for cat in book.categories.all()]} for book in books]
    return JsonResponse(data, safe=False)

def book_detail(request, pk):
    book = get_object_or_404(Book.objects.select_related('author').prefetch_related('categories', 'detail'), pk=pk)
    data = {
        "title": book.title,
        "author": book.author.name,
        "categories": [cat.name for cat in book.categories.all()],
        "summary": book.detail.summary,
        "pages": book.detail.pages
    }
    return JsonResponse(data)
```

---

### **B. Class-Based Views (CBVs)**
```python
from django.views import View
from django.http import JsonResponse
from django.views.generic import ListView, DetailView
from .models import Book

class BookListView(View):
    def get(self, request):
        books = Book.objects.select_related('author').prefetch_related('categories').all()
        data = [{"title": book.title, "author": book.author.name, "categories": [cat.name for cat in book.categories.all()]} for book in books]
        return JsonResponse(data, safe=False)

class BookDetailView(View):
    def get(self, request, pk):
        book = get_object_or_404(Book.objects.select_related('author').prefetch_related('categories', 'detail'), pk=pk)
        data = {
            "title": book.title,
            "author": book.author.name,
            "categories": [cat.name for cat in book.categories.all()],
            "summary": book.detail.summary,
            "pages": book.detail.pages
        }
        return JsonResponse(data)

class BookCRUDView(View):
    def get(self, request, pk=None):
        if pk:
            return BookDetailView().get(request, pk)
        return BookListView().get(request)

    def post(self, request):
        # Logic for creating a book
        pass

    def delete(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        book.delete()
        return JsonResponse({"message": "Book deleted"}, status=204)
```

---

### **C. Django REST Framework (ViewSets)**
```python
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.select_related('author').prefetch_related('categories', 'detail').all()
    serializer_class = BookSerializer
```

---

## **Step 3: Define URLs for Each View Type**
```python
from django.urls import path
from .views import book_list, book_detail, BookListView, BookDetailView, BookCRUDView
from rest_framework.routers import DefaultRouter
from .views import BookViewSet

# Function-Based Views
urlpatterns = [
    path('books/', book_list, name='book-list'),
    path('books/<int:pk>/', book_detail, name='book-detail'),
]

# Class-Based Views
urlpatterns += [
    path('cbv/books/', BookListView.as_view(), name='cbv-book-list'),
    path('cbv/books/<int:pk>/', BookDetailView.as_view(), name='cbv-book-detail'),
    path('cbv/books/crud/<int:pk>/', BookCRUDView.as_view(), name='book-crud'),
]

# DRF ViewSets
router = DefaultRouter()
router.register(r'api/books', BookViewSet, basename='api-books')
urlpatterns += router.urls
```

---

### **Step 4: Creating a Serializer for DRF**
```python
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    categories = serializers.StringRelatedField(many=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author_name', 'categories', 'published_date']
```

---

### **Optimization with `select_related` & `prefetch_related`**
- **`select_related("author")`** → Optimizes ForeignKey (one-to-many) queries.
- **`prefetch_related("categories")`** → Optimizes ManyToManyField queries.
- **`select_related("detail")`** → Optimizes OneToOneField queries.

---

## **Summary**
| Approach | CRUD Operations | URL Pattern |
|----------|---------------|-------------|
| **FBV** | `book_list` (GET), `book_detail` (GET) | `/books/`, `/books/<int:pk>/` |
| **CBV** | `BookListView` (GET), `BookDetailView` (GET), `BookCRUDView` (GET, POST, DELETE) | `/cbv/books/`, `/cbv/books/<int:pk>/`, `/cbv/books/crud/<int:pk>/` |
| **DRF ViewSet** | `BookViewSet` (GET, POST, PUT, DELETE) | `/api/books/`, `/api/books/<int:pk>/` |

This approach keeps the code modular and ensures optimized database queries. Would you like any refinements?