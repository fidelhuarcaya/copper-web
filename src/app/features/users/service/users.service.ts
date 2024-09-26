import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../interface/user.interface";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class UsersService {
    private apiUrl = 'http://localhost:9091/api/users';
  
    constructor(private http: HttpClient) { }
  
    getAll():Observable<User[]>{
        return this.http.get<User[]>(this.apiUrl);
    }
  

  }