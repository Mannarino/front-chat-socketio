import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrarSinRegistroComponent } from './entrar-sin-registro.component';

describe('EntrarSinRegistroComponent', () => {
  let component: EntrarSinRegistroComponent;
  let fixture: ComponentFixture<EntrarSinRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrarSinRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrarSinRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
