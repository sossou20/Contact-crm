import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  it('should create the app and show the navigation', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const nav = (fixture.nativeElement as HTMLElement).querySelector('nav');
    expect(fixture.componentInstance).toBeTruthy();
    expect(nav?.textContent).toContain('Contacts');
  });
});