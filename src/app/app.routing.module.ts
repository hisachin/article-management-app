import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';

import { ArticleListComponent } from './articles/article-list/article-list.component';
import { ArticleCreateComponent } from './articles/article-create/article-create.component';

const routes : Routes = [
    {path : '', component: ArticleListComponent},
    {path : 'add-new-article', component: ArticleCreateComponent},
    {path : 'edit-article/:articleId', component: ArticleCreateComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{} 