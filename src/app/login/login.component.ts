import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { ModalService } from './../_modal/modal.service';
import { Router }          from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  error = [];
  responseData;
  @Output() userEmail: EventEmitter<any> = new EventEmitter();
  constructor(private fb: FormBuilder,private modalService:ModalService,
     private loginService: LoginService,
     private router:Router) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(5)]],
      password: ['', Validators.required]
    });
  }

  isValidInput(fieldName): boolean {
    return this.loginForm.controls[fieldName].invalid &&
      (this.loginForm.controls[fieldName].dirty ||
        this.loginForm.controls[fieldName].touched);

  }

  login(): void {
    this.error = [];
    const userName = this.loginForm.value.userName;
    const password = this.loginForm.value.password;


    if (!this.loginForm.valid) {
      //  this.error = "Enter the details";
    }
    this.loginService.login(userName, password).subscribe(
      resData => {
        console.log("resData", resData);
        // setting data to session .........
        for (let i = 0; i < resData.Success.length; i++) {
          console.log("response Data", resData.Success[i]);
          this.responseData = resData.Success[i];
          window.sessionStorage.setItem("ID", this.responseData.id);
          window.sessionStorage.setItem("ROLE", JSON.stringify(this.responseData.role));
          window.sessionStorage.setItem("EMAIL", this.responseData.email);
          window.sessionStorage.setItem("USERNAME", this.responseData.username);

          // Update email on header....
          this.userEmail.emit(this.responseData.email);

          // reditecting according to the role....
          if(this.responseData.role == "JUNK_YARD_OWNER"){
            this.modalService.close('signUp_modal');
            this.router.navigate(['/junk-yard/buy-list']);
          }else {
            this.modalService.close('signUp_modal');
            // this.router.navigate(['/junkYard']);
          }
        }

        //  this.isLoading = false;
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        //   this.isLoading = false;
      }
    );
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  openModal(id: string) {
    this.closeModal('signUp_modal')
    this.modalService.open(id);
}
}


