import { ToastrService } from 'ngx-toastr';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Role } from 'src/app/base/role.enum';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/base/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<void> = new Subject();

  public formGroup: FormGroup;
  public modalRef: NgbModalRef;
  public usernameToForgetPassword: string;

  constructor(
    private fb: FormBuilder,
    private loginService: AuthService,
    private toastService: ToastrService,
    private router: Router,
    private ngbModal: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.ngBuildForm();
  }

  ngBuildForm(): void {
    this.formGroup = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

  ngSubmitForm(): void {
    Utils.beforeSubmitForm(this.formGroup);
    if (this.formGroup.invalid) {
      this.toastService.error('Thông tin không hợp lệ.');
      return;
    };
    this.loginService.login(this.formGroup.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.toastService.success('Đăng nhập thành công')
        if (res.user.role == Role.ADMIN) {
          this.router.navigate(['/admin', 'dashboard']);
          return;
        }
        this.router.navigate(['/home']);
      })
  }

  ngOnOpenForgetPassword(templateRef: TemplateRef<any>): void {
    this.modalRef = this.ngbModal.open(templateRef, {
      centered: true,
      animation: true
    })
  }

  ngOnSubmitForgetPassword(): void {
    if (!this.usernameToForgetPassword) return;
    this.authService.forgetPassword(this.usernameToForgetPassword)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.toastService.success('Mật khẩu đã được gửi tới Mail. Vui lòng kiểm tra.');
        this.modalRef.close();
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$?.next();
    this.unsubscribe$?.complete();
  }

}
