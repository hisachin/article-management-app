import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

//import model and services 
import { ArticleService } from "../articles.services";
import { Articles } from '../articles.model';

//import file validator to validate the input file
import { mimeType } from './file.validator';

@Component({
    selector: 'app-article-create',
    templateUrl : './article-create.component.html',
    styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent implements OnInit {
    
    article:Articles;
    private mode = 'add';
    private articleId: string;
    form : FormGroup;
    imagePreview:string;
    heading:string;
    isLoading:boolean;

    constructor(public articleService: ArticleService,public route:ActivatedRoute) {}

    ngOnInit(){

        //initialize our reactivefrom by using the FormGroup
        this.form = new FormGroup({
            "title": new FormControl(null,{
                validators: [Validators.required,Validators.minLength(3)]
            }),
            "content": new FormControl(null,{
                validators: [Validators.required]
            }),
            "image":new FormControl(null,{
                validators:[Validators.required],
                asyncValidators :[ mimeType ]
            })
        });

        //check if url contains any parameter
        //if it contains any parameter then load the 
        //edit component else load the add component
        this.route.paramMap.subscribe((paramMap : ParamMap) => {
            if(paramMap.has('articleId')){
                this.mode = 'edit';
                this.articleId = paramMap.get('articleId');
                //set loader to true
                this.isLoading = true;
                this.articleService.getSingleArticle(this.articleId).subscribe(articleData => {
                    //set loader to false
                    this.isLoading = false;
                    this.article = {id: articleData._id, title: articleData.title, content: articleData.content,imagePath:articleData.imagePath};
                    this.form.setValue({
                        title :this.article.title,
                        content:this.article.content,
                        image:this.article.imagePath
                    });
                    this.imagePreview = this.article.imagePath;
                    this.heading = 'Edit';
                });
            }else{
                this.heading = 'Add';
                this.mode = 'add';
                this.articleId = null;
            }
        });
    }

    //validate the file when user select the image
    //here we use the custom file validation written by third party
    onImagePicked(event : Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }

    //when user click on submit button of the form then
    //this function is called to do the add/edit action
    // along with form validation
    onSaveArticle() {
        if (this.form.invalid) {
            alert('All fields are required');
            return;
        }
        if(this.mode === 'add'){
            this.articleService.addArticle(this.form.value.title, this.form.value.content,this.form.value.image);
        }else{
            this.articleService.updateArticle(this.articleId,this.form.value.title, this.form.value.content,this.form.value.image);
        }
        
        this.form.reset();
    }
}