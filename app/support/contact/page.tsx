"use client";
import React, { useState } from "react";
import { TextInput, Textarea, Button, Text } from "@mantine/core";

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
      <Text>dfdf</Text>
      <form onSubmit={handleSubmit}>
        <TextInput
          required
          label="Your Email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <TextInput
          required
          label="Topic"
          placeholder="Help with Jade"
          value={topic}
          onChange={(event) => setTopic(event.currentTarget.value)}
        />

        <Textarea
          required
          label="Message"
          placeholder="Your message"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button type="submit" className="mt-4">
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default Contact;
