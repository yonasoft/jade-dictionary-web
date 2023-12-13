"use client";
import React, { useState } from "react";
import { TextInput, Textarea, Button, Text, Title } from "@mantine/core";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    // Logic to send email. You'll need to integrate with an email sending service.
    console.log("Sending Email:", { email, topic, message });

    // Reset form after sending email
    setEmail("");
    setTopic("");
    setMessage("");
  };

  return (
    <div className="mt-10">
      <Title order={2}>Contact Us</Title>
      <Text size="md">Questions, comments, need help? Contact Us!</Text>
      <form onSubmit={handleSubmit}>
        <TextInput
          className="my-3"
          required
          label="Your Email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <TextInput
          className="my-3"
          required
          label="Topic"
          placeholder="Help with Jade"
          value={topic}
          onChange={(event) => setTopic(event.currentTarget.value)}
        />

        <Textarea
          className="my-3"
          required
          label="Message"
          placeholder="Your message"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button className="my-4" type="submit">
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default Contact;
