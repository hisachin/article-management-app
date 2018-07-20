import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

//import model and services
import { Articles } from "../articles.model";
import { ArticleService } from "../articles.services";

@Component({
    selector: 'app-article-list',
    templateUrl : './article-list.component.html',
    styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit,OnDestroy {

    isLoading:boolean;
    articles: Articles[] = [];
    private articleSub: Subscription;

    constructor(public articleService : ArticleService ){}
    
    ngOnInit() {
        this.isLoading = true;
        this.articleService.getArticles();
        this.articleSub = this.articleService.getArticleUpdateListener()
          .subscribe((articles: Articles[]) => {
            this.isLoading = false;
            this.articles = articles;
          });
      }
    
      ngOnDestroy() {
        this.articleSub.unsubscribe();
      }
}