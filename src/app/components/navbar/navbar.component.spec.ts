import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BlankComponent } from 'src/app/mocks/blank/blank.component';
import { NavbarComponent } from './navbar.component';
import { AuthenticationService } from './services/authentication.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let location: Location;
  let page: any;
  let authenticationService: AuthenticationServiceMock;

  beforeEach(async () => {
    authenticationService = new AuthenticationServiceMock();

    await TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'signin', component: BlankComponent }
        ])
      ]
    })
    .overrideProvider(AuthenticationService, {useValue: authenticationService})
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    location = TestBed.inject(Location);
    
    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  describe('given user clicks on logout button', () => {
    
    beforeEach(() => {
      logoutButton().click();
      fixture.detectChanges();
    })

    it('then take user to signin page', done => {
      setTimeout(() => {
        expect(location.path()).toEqual('/signin');
        done();
      }, 100);
    })

    it('then do a logout', () => {
      expect(authenticationService._isLoggedOut).toBeTruthy();
    })

  })

  function logoutButton() {
    return page.querySelector('[test-id="logout-button"]');
  }

});

class AuthenticationServiceMock {
  _isLoggedOut = false;
  logout() {
    this._isLoggedOut = true;
  }
}