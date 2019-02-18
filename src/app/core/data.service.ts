import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoggerService } from './logger.service';
import { Reader } from '../models/reader';
import { allReaders, allBooks } from '../data';
import { Book } from '../models/book';
import { ProfileError } from '../models/ProfileError';

@Injectable()
export class DataService {

  mostPopularBook: Book = allBooks[0];

  getAuthorRecommendation(readerID: number): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (readerID > 0) {
          resolve('Dr. Seuss');
        } else {
          reject('Invalid reader ID');
        }
      }, 2000); 
    })
  }

  constructor(private loggerService: LoggerService,
              private http: HttpClient) { }

  getAllReaders(): Observable<Reader[] | ProfileError> {
    return this.http.get<Reader[]>('http://localhost:3000/api/readers')
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<ProfileError> {
    const dataError = new ProfileError();
    dataError.errorNumber = 100;
    dataError.message = error.statusText;
    dataError.friendlyMessage = 'An error occurred retrieving data.';
    return throwError(dataError);
  }  

  getReaderById(id: number): Reader {
    return allReaders.find(reader => reader.readerID === id);
  }

  // getAllBooks(): Book[] {
  //   return allBooks;
  // }

  getAllBooks():Observable< Book[] | ProfileError> {
    return this.http.get<Book[]>('http://localhost:3000/api/books')
    .pipe(
      catchError(this.handleError)
    );
  }
  getBookById(id: number): Book {
    return allBooks.find(book => book.bookID === id);
  }

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }
}
