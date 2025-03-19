import { EncryptPasswordPipe } from './encrypt-password.pipe';

describe('EncryptPasswordPipe', () => {
  it('create an instance', () => {
    const pipe = new EncryptPasswordPipe();
    expect(pipe).toBeTruthy();
  });
});
