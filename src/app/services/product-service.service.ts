import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class ProductService {
  // private apiUrl = '/assets/product.json';

  constructor(private http: HttpClient, private router:Router) { }

 getRecords()
  {
    return this.http.get('http://localhost:3000/product');
  }

  postData(data:any)
  {
    return this.http.post('http://localhost:3000/product',data);
  }

  deleteDataById(id: number){

    const url = `http://localhost:3000/product/${id}`;
    return this.http.delete(url);
  }

  getData() {
  // Replace the URL with the actual endpoint to fetch the data
  return this.http.get('http://example.com/data');
}
}
