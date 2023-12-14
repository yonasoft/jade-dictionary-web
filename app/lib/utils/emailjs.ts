import emailjs from 'emailjs-com';


export const sendEmail = (e:React.FormEvent<HTMLFormElement>) => {
  	e.preventDefault();

	console.log('Service ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);
	console.log('Template ID:', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID);
	console.log('Public Key:', process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);


	emailjs.sendForm(
	process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
	process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
	e.target as HTMLFormElement,
	process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
	)
	.then((result) => {
		console.log(result.text);
	}, (error) => {
		console.error(error.text);
		console.log(
			process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
			process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
			process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string)
	});
};
