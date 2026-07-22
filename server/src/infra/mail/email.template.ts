import handlebars from 'handlebars';
import path from 'path';
import fs, { access } from 'fs';
import { sendEmail } from './nodemailer.service';
import {
  COMPANY_FACEBOOK,
  COMPANY_INSTAGRAM,
  COMPANY_TWITTER,
  COMPANY_LOGO,
  COMPANY_LINKEDIN,
  CLIENT_URL,
  COMPANY_EMAIL,
  COMPANY_PHONE,
} from '@config/env';

export function sendVerifyEmail(userEmail: string, firstname: string, code: number) {
  const emailBody = getVerifyEmailHTML(firstname, code);
  sendEmail(userEmail, emailBody, 'Ethiohope - Verification Email');
}

function getVerifyEmailHTML(firstname: string, code: number): string {
  const filePath = path.join(__dirname, '/templates/VerifyEmail.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    code,
    username: firstname,
  };
  const htmlToSend = template(replacements);
  return htmlToSend;
}

export function sendResetPasswordEmail(userEmail: string, firstname: string, userId: string, accessToken: string) {
  const emailBody = getForgetPasswordHTML(firstname, userId, accessToken);
  sendEmail(userEmail, emailBody, 'Ethiohope - Password Reset');
}

export function getForgetPasswordHTML(firstname: string, userId: string, accessToken: string): string {
  const filePath = path.join(__dirname, '/templates/ForgetPassword.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    facebook: COMPANY_FACEBOOK,
    instagram: COMPANY_INSTAGRAM,
    linkedin: COMPANY_LINKEDIN,
    logo: COMPANY_LOGO,
    twitter: COMPANY_TWITTER,
    redirectURL: `${CLIENT_URL}auth/change-password/${userId}?token=${accessToken}`,
    firstname,
  };
  const htmlToSend = template(replacements);
  return htmlToSend;
}

// export function sendCertificateEmail(certificatePDF: string, traineeEmail: string, username: string, courseName: string, examGrade: string) {
//   const emailBody = getCertificateEmailHTML(username, courseName, examGrade);
//   const certificateAttachment = prepareCertificateAttachment(certificatePDF);
//   sendEmail(traineeEmail, emailBody, 'You officially graduated!!!', certificateAttachment as Attachment[]);
// }

// export function getCertificateEmailHTML(username: string, courseName: string, examGrade: string): string {
//   const filePath = path.join(__dirname, '/templates/Certificate.html');
//   const source = fs.readFileSync(filePath, 'utf-8').toString();
//   const template = handlebars.compile(source);
//   const replacements = {
//     facebook: COMPANY_FACEBOOK,
//     instagram: COMPANY_INSTAGRAM,
//     linkedin: COMPANY_LINKEDIN,
//     logo: COMPANY_LOGO,
//     twitter: COMPANY_TWITTER,
//     canchamEmail: COMPANY_EMAIL,
//     canchamPhone: COMPANY_PHONE,
//     username,
//     courseName,
//     examGrade,
//   };
//   const htmlToSend = template(replacements);
//   return htmlToSend;
// }

// function prepareCertificateAttachment(certificatePDF: string) {
//   const certificateAttachment: any[] = [
//     {
//       filename: 'certificate.pdf',
//       path: certificatePDF,
//       //
//     },
//     // {
//     //   filename,
//     //   //content:fs.createReadStream(path.join(__dirname,'../../Uploads/certificate.png')), // image
//     //   path: path.join(__dirname, '../../Uploads/certificate.pdf'), // pdf
//     //   contentType: 'application/pdf',
//     // },
//   ];
//   return certificateAttachment;
// }
