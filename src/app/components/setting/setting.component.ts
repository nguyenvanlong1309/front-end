import { HttpClient } from '@angular/common/http';
import { UserResponseModel } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  isModal: boolean = false;
  user: UserResponseModel;
  formGroup: FormGroup;

  closeResult: string;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private HttpClient: HttpClient,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUser$.getValue().user;
    this.ngBuildForm();
    this.formGroup.patchValue(this.user);
  }

  ngBuildForm(): void {
    this.formGroup = this.fb.group({
      fullName: [null, [Validators.required]],
      Password: [null, [Validators.required]],
      phone: [null],
    })
  }

  ngModal(): void {

  }

  open(content:any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openXl(content:any) {
		this.modalService.open(content, { size: 'xl' });
	}

  openXl2(historyDonate:any) {
		this.modalService.open(historyDonate, { size: 'xl' });
	}

  openScrollableContent(longContent:any) {
		this.modalService.open(longContent, { scrollable: true });
	}

}
