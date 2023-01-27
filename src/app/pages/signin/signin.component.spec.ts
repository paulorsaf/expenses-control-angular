import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from './signin.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BlankComponent } from 'src/app/mocks/blank/blank.component';
import { AuthenticationService } from './services/authentication.service';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let page: any;
  let location: Location;
  let authenticationService: AuthenticationServiceMock;
  let snackBar: SnackBarMock;

  beforeEach(async () => {
    authenticationService = new AuthenticationServiceMock();
    snackBar = new SnackBarMock();

    await TestBed.configureTestingModule({
      declarations: [ SigninComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {path: 'home', component: BlankComponent}
        ])
      ]
    })
    .overrideProvider(AuthenticationService, {useValue: authenticationService})
    .overrideProvider(MatSnackBar, {useValue: snackBar})
    .compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    location = TestBed.inject(Location);

    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  describe('given form', () => {

    it('when email is empty, then recover password button should be disabled', () => {
      setEmail('');
  
      expect(recoverPasswordButton().disabled).toBeTruthy();
    })
  
    it('when email is invalid, then recover password button should be disabled', () => {
      setEmail('invalidEmail');
  
      expect(recoverPasswordButton().disabled).toBeTruthy();
    })
  
    it('when email is valid, then recover password button should be enabled', () => {
      setEmail('valid@email.com');
  
      expect(recoverPasswordButton().disabled).toBeFalsy();
    })

  })

  describe('Login flow', () => {

    describe('given form', () => {

      it('when email is empty, then login button should be disabled', () => {
        setEmail('');
        setPassword('anyPassword');
    
        expect(loginButton().disabled).toBeTruthy();
      })
  
      it('when email is invalid, then login button should be disabled', () => {
        setEmail('invalidEmail');
        setPassword('anyPassword');
    
        expect(loginButton().disabled).toBeTruthy();
      })

      it('when password is empty, then login button should be disabled', () => {
        setEmail('valid@email.com');
        setPassword('');
    
        expect(loginButton().disabled).toBeTruthy();
      })
  
      it('when form is valid, then login button should be enabled', () => {
        setEmail('valid@email.com');
        setPassword('anyPassword');
    
        expect(loginButton().disabled).toBeFalsy();
      })

    })

    describe('given user clicks on login button', () => {

      beforeEach(() => {
        setEmail('valid@email.com');
        setPassword('anyPassword');
        loginButton().click();
        fixture.detectChanges();
      })

      it('the show login loader', () => {
        expect(loginLoader()).not.toBeNull();
      })
  
      it('the hide login button', () => {
        expect(loginButton()).toBeNull();
      })

      describe('when login is successful', () => {

        beforeEach(() => {
          authenticationService._signInResponse.next({id: "anyUserId"});
        })

        it('then go to home page', done => {
          setTimeout(() => {
            expect(location.path()).toEqual('/home');
            done();
          }, 100)
        })

      })

      describe('when login fails', () => {

        beforeEach(() => {
          authenticationService._signInResponse.error({message: "anyError"});
          fixture.detectChanges();
        })

        it('then do not go to home page', () => {
          expect(location.path()).not.toEqual('/home');
        })

        it('then hide login loader', () => {
          expect(loginLoader()).toBeNull();
        })

        it('then show login button', () => {
          expect(loginButton()).not.toBeNull();
        })

        it('then show error message', () => {
          expect(snackBar._isOpened).toBeTruthy();
        })

      })

    })

  })

  function setEmail(value: string) {
    component.form.get('email')?.setValue(value);
    fixture.detectChanges();
  }

  function setPassword(value: string) {
    component.form.get('password')?.setValue(value);
    fixture.detectChanges();
  }

  function recoverPasswordButton() {
    return page.querySelector('[test-id="recover-password-button"]');
  }

  function loginButton() {
    return page.querySelector('[test-id="login-button"]');
  }

  function loginLoader() {
    return page.querySelector('[test-id="login-loader"]');
  }

});

class AuthenticationServiceMock {
  _signInResponse = new Subject();
  signIn() {
    return this._signInResponse.asObservable();
  }
}

class SnackBarMock {
  _isOpened = false;
  open() {
    this._isOpened = true;
  }
}