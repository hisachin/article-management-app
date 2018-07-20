//import essential module for this component
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject} from 'rxjs';
import { Router } from "@angular/router";

//import article model file which consist the our article datatype so that
// we can't mix this in future that which variable is for what type
import { Articles } from "./articles.model";

@Injectable({providedIn: 'root'})
export class ArticleService {
  private articles: Articles[] = [];
  private articleUpdated = new Subject<Articles[]>();

  constructor(private http : HttpClient,private router :Router){};

  //this is used to get the article from the server
  getArticles() {
    this.http.get<{status:boolean,message:Articles[]}>("http://localhost:3000/api/v1/articles/")
    .subscribe((articleData) => {
        this.articles = articleData.message;
        this.articleUpdated.next([...this.articles]);
    });
  }

  //this is used to track any update in the page
  getArticleUpdateListener() {
    return this.articleUpdated.asObservable();
  }
  
  //this is used to get the single article by article id from the server
  getSingleArticle(id: string){
    return this.http.get<{ _id: string; title: string; content: string,time:Date,imagePath:string }>(
      "http://localhost:3000/api/v1/articles/" + id
    );
  }

  //this is used to create new article
  addArticle(title: string, content: string, image:File) {
    const postData = new FormData();
    postData.append('title',title);
    postData.append('content',content);
    postData.append('image',image,title);
    this.http
      .post<{ status:boolean,message: string ,article:Articles}>("http://localhost:3000/api/v1/articles", postData)
      .subscribe(responseData => {
        if(responseData.status){
          this.router.navigate(['/']);
        }else{
          alert(responseData.message);
        }
        
      });
  }

  //this is used to edit the article
  updateArticle(id:string,title: string, content: string,image:File | string ){
    let postData: Articles| FormData;
    if(typeof(image) === 'object'){
      postData = new FormData();
      postData.append('id',id);
      postData.append('title',title);
      postData.append('content',content);
      postData.append('image',image,title);
    }else{
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put<{ status:boolean,message: string}>("http://localhost:3000/api/v1/articles/" + id, postData)
      .subscribe(responseData => {
        if(responseData.status){
          this.router.navigate(["/"]);
        }else{
          alert(responseData.message);
        }
        
      });
  }
}