import emailjs from 'emailjs-com';


export const sendEmail = (e:React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  emailjs.sendForm(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  as string,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
    e.target as HTMLFormElement,
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
  ).then((result:any) => {
      console.log(result.text);
  }, (error:any) => {
      console.error(error.text);
  });
};
