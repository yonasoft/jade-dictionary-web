"use client";
import React, { useState } from "react";
import { TextInput, Textarea, Button, Text, Title } from "@mantine/core";
import { sendEmail } from "@/app/lib/services/emailjs/emailjs";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Logic to send email. You'll need to integrate with an email sending service.
    console.log("Sending Email:", { email, topic, message });

    sendEmail(e);

    setEmail("");
    setTopic("");
    setMessage("");
  };

  return (
    <div className="mt-10" aria-labelledby="contact-form">
      <Title order={2}>Contact Us</Title>
      <Text size="md">Questions, comments, need help? Contact Us!</Text>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <TextInput
          className="my-3"
          required
          label="Your Email"
          placeholder="your.email@example.com"
          name="user_email" // Matches the variable in your EmailJS template
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <TextInput
          className="my-3"
          required
          label="Topic"
          placeholder="Help with Jade"
          name="user_topic" // Matches the variable in your EmailJS template
          value={topic}
          onChange={(event) => setTopic(event.currentTarget.value)}
        />

        <Textarea
          className="my-3"
          required
          label="Message"
          placeholder="Your message"
          name="user_message" // Matches the variable in your EmailJS template
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button variant="outline" className="my-3" type="submit">
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default Contact;
