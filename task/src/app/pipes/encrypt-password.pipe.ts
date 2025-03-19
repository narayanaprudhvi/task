import { Pipe, PipeTransform } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Pipe({
  name: 'encryptPassword',
  standalone: true
})
export class EncryptPasswordPipe implements PipeTransform {

  // Replace with your own secret key
  private secretKey: string = 'your-secret-key';

  transform(value: string): string {
    if (!value) return value;

    // Encrypt the password using AES encryption
    const encryptedValue = CryptoJS.AES.encrypt(value, this.secretKey).toString();
    return encryptedValue;
  }
}
