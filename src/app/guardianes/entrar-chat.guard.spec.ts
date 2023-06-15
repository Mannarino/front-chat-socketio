import { TestBed } from '@angular/core/testing';

import { EntrarChatGuard } from './entrar-chat.guard';

describe('EntrarChatGuard', () => {
  let guard: EntrarChatGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EntrarChatGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
